'use strict';

const alfy = require('alfy');
const md5 = require('md5');

const baiduTransAPI = {
	url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
	appid: '20170625000060222',
	key: '2dlAYT1dFruhnrQj7yWL',
	salt: 1039057373
};

const alfredQuery = alfy.input || '好 to en';

const LANGUAGE_MAP = {
	zh:	'中文',
	en:	'英语',
	yue: '粤语',
	wyw: '文言文',
	jp:	'日语',
	kor: '韩语',
	fra: '法语',
	spa: '西班牙语',
	th:	'泰语',
	ara:	'阿拉伯语',
	ru:	'俄语',
	pt:	'葡萄牙语',
	de:	'德语',
	it:	'意大利语',
	el:	'希腊语',
	nl:	'荷兰语',
	pl:	'波兰语',
	bul: '保加利亚语',
	est: '爱沙尼亚语',
	dan: '丹麦语',
	fin: '芬兰语',
	cs:	'捷克语',
	rom: '罗马尼亚语',
	slo: '斯洛文尼亚语',
	swe: '瑞典语',
	hu:	'匈牙利语',
	cht: '繁体中文',
	vie: '越南语',
};

function checkConversionLang(str) {
	for (let key in LANGUAGE_MAP){
		const result = new RegExp(` to ${key}$| to ${LANGUAGE_MAP[key]}$`).exec(str);
		console.log(result, '字符串匹配结果')
	}
}

function checkIsChinese(str) {
	checkConversionLang(str)
	const isChinese = new RegExp("[\\u4E00-\\u9FFF]+", 'g').test(str);
	if (isChinese) {
		return 'en'
	}
	return 'zh'
}

let params = {
	method: 'POST',
	body: {
		q: alfredQuery,
		from: 'auto',
		to: checkIsChinese(alfredQuery),
		appid: baiduTransAPI.appid,
		salt: baiduTransAPI.salt,
		sign: md5(baiduTransAPI.appid + alfredQuery + baiduTransAPI.salt + baiduTransAPI.key)
	}
};

alfy.fetch(baiduTransAPI.url, params).then(
	res => {
		let result = res.trans_result.map(res => {
			return {
				title: res.src,
				subtitle: res.dst
			}
		});

		alfy.output(result);
	});
