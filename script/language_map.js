/*
* 1 建立一份通用表，用来处理相同语言
* */

const Language = {
	//  百度
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

	// 有道
	no: '挪威语',
	hi: '印地语',
	id: '印度尼西亚语',
	tr: '土耳其语'
};

const yd_language = {
	zh: 'zh-CHS',
	en: 'EN',
	jp: 'ja',
	kor: 'ko',
	fra: 'fr',
	spa: 'es',
	th: 'th',
	ara: 'ar',
	dan: 'da',
	fin: 'fi',
	rom: 'ro',
	slo: 'sk',
	swe: 'sv',
	no: 'no',
	hi: 'hi',
	id: 'id',
	tr: 'tr'
};

module.exports.language_map = Language;
module.exports.yd_language = yd_language;
