const md5 = require('md5');
const alfy = require('alfy');
const config = require('./config');
const errorMap = require('./error_map');
const exec = require('child_process').exec;
const {language_map, yd_language} = require('./language_map');

const parrot = {
	isPlaySound: false,

	// 检测是否是中文
	checkIsChineseText(str) {
		return new RegExp("[\\u4E00-\\u9FFF]+", 'g').test(str);
	},

	// 检测用户是否指定了转换目标语言
	checkUserDidCustomTargetLang(str) {
		let userCustomTransLang;

		for (let key in language_map){
			const result = new RegExp(` to ${key}$| to ${language_map[key]}$`).exec(str);

			if (result){
				userCustomTransLang = result[0].split(' to ')[1];
			}
		}
		return userCustomTransLang;
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

		if (type === 'youdao') {
			targetLanguage = Object.assign(language_map, yd_language)[targetLanguage];
		}

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

		return alfy.fetch(url,{
			body: Object.assign(defaultParams, params)
		}).then( res => {
			return new Promise((success, fail) => {
				errorMap[res.errorCode||res.error_code] ?
					fail(errorMap[res.errorCode||res.error_code]):
					success(res);
			});
		})
	},

	// 获取最终用户输入的Text
	getTransLanguage(str, cb) {
		str = parrot.userWantPlaySound(str);

		// 返回的数据格式
		let alfredIO = {
			queryText: str,
			targetLanguage: parrot.checkIsChineseText(str) ? 'en':'zh',
			isPlaySound: parrot.isPlaySound
		};

		// 用户指定了转换语言
		let targetLanguage = parrot.checkUserDidCustomTargetLang(str);
		if (targetLanguage) {

			if (parrot.checkIsChineseText(targetLanguage)){
				// 根据中文value检索出对应的key
				for (let key in Object.keys(language_map)){
					if (language_map[key] === targetLanguage){
						targetLanguage = key
					}
				}
			}

			alfredIO.queryText = str.split(' to ')[0];
			alfredIO.targetLanguage = targetLanguage;
		}

		parrot.fetchTransResult(alfredIO.queryText, targetLanguage).then(res => {
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
			parrot.fetchTransResult(alfredIO.queryText, targetLanguage, 'baidu').then(res => {
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

