const exec = require('child_process').exec;
const LANGUAGE_MAP = require('./Language_Map');

const parrot = {
	checkIsChineseText(str) {
		return new RegExp("[\\u4E00-\\u9FFF]+", 'g').test(str);
	},

	checkUserDidCustomTargetLang: function (str) {
		let userCustomTransLang = null;

		for (let key in LANGUAGE_MAP){
			const result = new RegExp(` to ${key}$| to ${LANGUAGE_MAP[key]}$`).exec(str);

			if (result){
				userCustomTransLang = result[0].split(' to ')[1];
			}
		}
		return userCustomTransLang;
	},

	getTransLanguage(str) {
		// 返回的数据格式
		let alfredIO = {
			queryText: str,
			targetLanguage: 'ja'
		};

		// 用户指定了转换语言
		let userCustomTargetLang = parrot.checkUserDidCustomTargetLang(str);
		if (userCustomTargetLang) {
			// 转换语言的标志是中文
			if (parrot.checkIsChineseText(userCustomTargetLang)){
				for (let langKey in LANGUAGE_MAP) {
					LANGUAGE_MAP[langKey] === userCustomTargetLang ? userCustomTargetLang = langKey : '';
				}
			}

			alfredIO.queryText = str.split(' to ')[0];
			alfredIO.targetLanguage = userCustomTargetLang;

		}else if (parrot.checkIsChineseText(str)){
			//默认如果用户输入的是中文的话，那直接转换成英文，如果用户输入的是非中文，则默认转换成中文。
			alfredIO.targetLanguage = 'en'
		}

		return alfredIO
	},

	playSound(text) {
		exec(`say ${text}`)
	},

	debug(){console.log('debug success')}
}

exports.parrot = parrot
