'use strict';

/*
* 1. Logo 设计
* 2. 回车键复制已翻译的文本
* 3. 发音
* */

const alfy = require('alfy');
const md5 = require('md5');

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
	ara: '阿拉伯语',
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

const baiduTransAPI = {
	url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
	appid: '20170625000060222',
	key: '2dlAYT1dFruhnrQj7yWL',
	salt: 1039057373
};

const alfredInputText = alfy.input || 'yes to en';

function checkIsChineseText(str) {
	return new RegExp("[\\u4E00-\\u9FFF]+", 'g').test(str);
}

function checkUserDidCustomTargetLang(str) {
	let userCustomTransLang = null;

	for (let key in LANGUAGE_MAP){
		const result = new RegExp(` to ${key}$| to ${LANGUAGE_MAP[key]}$`).exec(str);

		if (result){
			userCustomTransLang = result[0].split(' to ')[1];
		}
	}
	return userCustomTransLang;
}

function getTransLanguage(str) {
	// 返回的数据格式
	let alfredIO = {
		queryText: str,
		targetLanguage: 'zh'
	};

	// 如果用户指定了转换语言
	let userCustomTargetLang = checkUserDidCustomTargetLang(str);
	if (userCustomTargetLang) {
		// 转换语言的标志是中文
		if (checkIsChineseText(userCustomTargetLang)){
			for (let langKey in LANGUAGE_MAP) {
				LANGUAGE_MAP[langKey] === userCustomTargetLang ? userCustomTargetLang = langKey : '';
			}
		}

		alfredIO.queryText = str.split(' to ')[0];
		alfredIO.targetLanguage = userCustomTargetLang;
	}else if (checkIsChineseText(str)){
		//默认如果用户输入的是中文的话，那直接转换成英文，如果用户输入的是非中文，则默认转换成中文。
		alfredIO.targetLanguage = 'en'
	}

	return alfredIO
}

const {queryText, targetLanguage} = getTransLanguage(alfredInputText);

let params = {
	method: 'POST',
	body: {
		q: queryText,
		from: 'auto',
		to: targetLanguage,
		appid: baiduTransAPI.appid,
		salt: baiduTransAPI.salt,
		sign: md5(baiduTransAPI.appid + alfredInputText + baiduTransAPI.salt + baiduTransAPI.key)
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
	}
);
