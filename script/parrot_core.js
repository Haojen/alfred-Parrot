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
	checkUserDidCustomTargetLang(str, type) {
		let targetLanguage;

		const lang_map = Object.keys(language_map[type]);

		for (let index in lang_map ) {
			const result = new RegExp(` to ${lang_map[index]}$| to ${language_map[type][lang_map[index]].chineseText}$`).exec(str);

			if (result){
				targetLanguage = result[0].split(' to ')[1];

			}
		}

		if (targetLanguage) {
			str =  str.split(' to ')[0];

			if (parrot.checkIsChineseText(targetLanguage)) {

				for (let index in lang_map){
					let key = lang_map[index];
					let dict = language_map[type][key];

					if (dict.chineseText === targetLanguage){
						targetLanguage = dict.key
					}
				}


			}else {
				targetLanguage = language_map[type][targetLanguage].key;

			}
		}else {
			targetLanguage = parrot.checkIsChineseText(str) ? 'en':'zh'
		}


		return {
			query: str,
			targetLanguage
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

	fetchTransResult(str, type = 'youdao') {
		const {url, appid, key, salt} = config[type];

		const {query, targetLanguage} = parrot.checkUserDidCustomTargetLang(str, type);

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

	getYoudaoResult(query, cb) {
		parrot.fetchTransResult(query).then(res => {
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

		}, err => {
			cb&&cb([{
				title: err,
				arg: err
			}])
		})
	},

	getBaiduResult(query, cb) {
		parrot.fetchTransResult(query, 'baidu').then(res => {
			let result = res.trans_result.map(res => {
				return {
					title: res.dst,
					subtitle: res.src,
					arg: res.dst,
				}
			});

			cb&&cb(result);
			parrot.isPlaySound ? parrot.playSound(res.dst) : null;
		}, err => {
			cb&&cb([{
				title: err,
				arg: err
			}])
		});
	},

	// 获取最终用户输入的Text
	getTransLanguage(query, cb) {
		const yd = config['youdao'];
		const bd = config['baidu'];

		if (yd.appid && yd.key) {
			parrot.getYoudaoResult(query, cb);
			return
		}

		if (bd.appid && bd.key) {
			parrot.getBaiduResult(query, cb);
			return
		}

		if (!(yd.appid && yd.key && bd.appid && bd.key)) {
			cb && cb([{
				title: '请先在 workflow 中配置至少一个翻译接口',
				subtitle: '貌似没有配置您的有道或者百度翻译接口, 或者配置格式错误, 解决方法请看使用文档'
			}]);
		}
	},
};

exports.parrot = parrot;

