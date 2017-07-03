const md5 = require('md5');
const alfy = require('alfy');
const config = require('./config');
const errorMap = require('./error_map');
const exec = require('child_process').exec;
const language_map = require('./language_map');

const parrot = {
	isPlaySound: false,

	// 检测是否是中文
	checkIsChineseText(str) {
		return new RegExp("[\\u4E00-\\u9FFF]+", 'g').test(str);
	},

	// 检测用户是否指定了转换目标语言
	checkUserDidCustomTargetLang(str) {
		let targetLanguage;

		// 先循环查找有道
		for (let obj in language_map.yd){
			const result = new RegExp(` to ${obj.key}$| to ${language_map.yd[obj.chineseText]}$`).exec(str);

			if (result){
				targetLanguage = result[0].split(' to ')[1];
			}
		}

		// 如果在有道里不存在对应的,则在百度里查找
		if (!targetLanguage) {
			for (let obj in Object.keys(language_map.bd)) {
				const result = new RegExp(` to ${obj.key}$| to ${language_map.bd[obj.chineseText]}$`).exec(str);
				if (result){
					targetLanguage = result[0].split(' to ')[1];
				}
			}
		}

		if (targetLanguage && parrot.checkIsChineseText(targetLanguage)){
			// 根据中文value检索出对应的key
			for (let key in Object.keys(language_map.yd)){
				if (language_map.yd[key].chineseText === str){
					targetLanguage = language_map.yd[key].key
				}
			}
		}

		let query;
		if (targetLanguage) {
			query = str.split(' to ')[0];
		}else {
			query = str;
			targetLanguage =  parrot.checkIsChineseText(str) ? 'en':'zh'
		}

		return {
			queryText: query,
			targetLanguage: targetLanguage
		};
	},

	// 检测用户是否要播放单词
	userWantPlaySound(text) {
		parrot.isPlaySound = text[0] === ':' || text[0] === '：';

		if (parrot.isPlaySound){
			return text.slice(1)
		}
		return text
	},

	playSound(text) {
		exec(`say ${text}`)
	},

	fetchTransResult(query, targetLanguage, type = 'youdao') {
		const {url, appid, key, salt} = config[type];

		const defaultParams = {
			q: query,
			salt: salt,
			from: 'auto',
			to: targetLanguage
		};

		const params = {
			[type === 'youdao'?'appKey':'appid']: appid,
			sign: md5(appid + query + salt + key)
		};

		return alfy.fetch(url,{body: Object.assign(defaultParams, params)}).then(res => {
			return new Promise((success, fail) => {
				errorMap[res.errorCode||res.error_code]
				? fail(errorMap[res.errorCode||res.error_code])
				: success(res);
			});
		})
	},

	// 获取最终用户输入的Text
	getTransLanguage(str, cb) {
		const {appid, key} = config['youdao'];

		if (!appid || !key) {
			cb&&cb([{
				title: '请先在 workflow 中配置有道翻译',
				subtitle: '在尝试使用有道翻译时遇到了这个问题, 解决方法请看使用文档'
			}]);

			return;
		}

		str = parrot.userWantPlaySound(str);

		// 用户指定了转换语言
		let alfredIO = parrot.checkUserDidCustomTargetLang(str);

		parrot.fetchTransResult(alfredIO.queryText, alfredIO.targetLanguage).then(res => {
			let result;

			if (res.query && res.web) {
				const web = res.web;
				const query = res.query;
				const basic = res.basic;
				const explainsDetail = basic ? basic.explains.join('') : '';
				const explains = `;${basic ? basic.phonetic : ''}`;

				res.translation.push(`[${explainsDetail}]`);

				web.unshift({
					value: res.translation,
					key: query + explains
				});

				result = web.map(trsItem => {
					let title = trsItem.value.join();
					return {
						title,
						subtitle: trsItem.key,
						arg: trsItem.value[0],
					}
				})
			}else {
				// 非中译英，英译中的结果
				result = res.translation.map(trsItem => {
					return {
						title: trsItem,
						arg:trsItem,
					}
				})
			}
			cb&&cb(result);
			parrot.isPlaySound ? parrot.playSound(res.translation[0]):null;

		}, () => {
			const {appid, key} = config['baidu'];

			if (!appid || !key) {
				cb&&cb([{
					title: '请先在 workflow 中配置百度翻译',
					subtitle: '在尝试使用百度作为备用翻译时遇到了这个问题, 解决方法请看使用文档'
				}]);

				return
			}

			parrot.fetchTransResult(alfredIO.queryText, alfredIO.targetLanguage, 'baidu').then(res => {
				let result = res.trans_result.map(res => {
					return {
						title: res.dst,
						subtitle: res.src,
						arg: res.dst,
					}
				});

				cb&&cb(result);
				parrot.isPlaySound ? parrot.playSound(res.dst):null;
			}, err => {
				cb&&cb([{
					title: err,
					arg: err
				}])
			});
		})
	},
};

exports.parrot = parrot;

