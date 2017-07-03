/*
* 1 建立一份通用表，用来处理相同语言
* */

const language_map = {
	yd : {
		zh: {
			key: 'zh-CHS',
			chineseText: '中文'
		},
		en: {
			key: 'EN',
			chineseText: '英语'
		},
		jp: {
			key: 'ja',
			chineseText: '日语'
		},
		kor: {
			key: 'ko',
			chineseText: '韩语'
		},
		fra: {
			key: 'fra',
			chineseText: '法语'
		},
		spa: {
			key: 'es',
			chineseText: '西班牙语'
		},
		th: {
			key: 'th',
			chineseText: ''
		},
		ara: {
			key: 'ar',
			chineseText: ''
		},

	},

	bd : {
		zh: {
			key: 'zh',
			chineseText: '中文'
		},
		en: {
			key: 'en',
			chineseText: '英语'
		},
		yue: {
			key: 'yue',
			chineseText: '粤语'
		},
		wyw: {
			key: 'wyw',
			chineseText: '文言文'
		},
		jp: {
			key: 'zh-CHS',
			chineseText: ''
		},
		kor: {
			key: 'zh-CHS',
			chineseText: ''
		},
		fra: {
			key: 'zh-CHS',
			chineseText: ''
		},
		spa: {
			key: 'spa',
			chineseText: '西班牙语'
		},
		cht: {
			key: 'cht',
			chineseText: '繁体'
		},
		el: {
			key: 'el',
			chineseText: ' 希腊语'
		},
	}
};

module.exports.language_map = Language;
module.exports.yd_language = yd_language;
