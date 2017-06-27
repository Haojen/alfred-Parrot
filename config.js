const md5 = require('md5');
const alfy = require('alfy');

const API = {
	youdao: {
		url: 'https://openapi.youdao.com/api',
		appKey: '0d68776be7e9be0b',
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
	let apiBody = null;
	let requestUrl = null;

	if (type === 'youdao') {
		const {url, appKey, key, salt} = API.youdao;
		requestUrl = url;

		apiBody	= {
			appKey,
			sign: md5(appKey + query + salt + key)
		}
	}else {
		const {url, appid, salt, key} = API.baidu;

		requestUrl = url;
		apiBody = {
			appid: appid,
			key: baidu.key,
			sign: md5(appid + query + salt + key)
		}
	}

	const defaultBody = {
		q: query,
		from: 'auto',
		to: targetLanguage,
	};

	return alfy.fetch(requestUrl,{body: Object.assign(defaultBody, apiBody)})
}

exports.getTransitionResult = getTransitionResult;
