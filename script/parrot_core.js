const exec = require('child_process').exec;
const {language_map} = require('./language_map');

const parrot = {
	checkIsChineseText(str) {
		return new RegExp("[\\u4E00-\\u9FFF]+", 'g').test(str);
	},

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

	getTransLanguage(str) {
		// 返回的数据格式
		let alfredIO = {
			queryText: str,
			targetLanguage: 'zh'
		};

		// 用户指定了转换语言
		let userCustomTargetLang = parrot.checkUserDidCustomTargetLang(str);
		if (userCustomTargetLang) {
			// 转换语言的标志是中文
			if (parrot.checkIsChineseText(userCustomTargetLang)){
				for (let langKey in language_map) {
					language_map[langKey] === userCustomTargetLang ? userCustomTargetLang = langKey : '';
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

	userWantPlaySound(text) {
		return text[0] === ':' || text[0] === '：';
	},

	playSound(text) {
		exec(`say ${text}`)
	},
};

exports.parrot = parrot;

