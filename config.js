const md5 = require('md5');
const alfy = require('alfy');
const {language_map, yd_language} = require('./Language_Map');
const API = {
	youdao: {
		url: 'https://openapi.youdao.com/api',
		appid: '0d68776be7e9be0b',
		key: 'MIbu7DGsOPdbatL9KmgycGx0qDOzQWCM',
		salt: 1039057373
	},
	baidu: {
		url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
		appid: '20170625000060222',
		key: '2dlAYT1dFruhnrQj7yWL',
		salt: 1039057373
	}
};


function getTransitionResult(query, targetLanguage, type = 'youdao') {
	const {url, appid, key, salt} = API[type];

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

	return alfy.fetch(url,{body: Object.assign(defaultParams, params)})
}

exports.getTransitionResult = getTransitionResult;
