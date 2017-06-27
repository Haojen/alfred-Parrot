'use strict';
const alfy = require('alfy');

const fetch = require('./config');
const {parrot} = require('./parrot_core');
const alfredInputText = alfy.input || 'Debug to 日语';

const {queryText, targetLanguage} = parrot.getTransLanguage(alfredInputText);

fetch.getTransitionResult(queryText, targetLanguage, 'baidu').then(res => {
	console.log(res, '返回的有道翻译结果')
	// let result = res.trans_result.map(res => {
	// 	return {
	// 		title: res.dst,
	// 		subtitle: res.src,
	// 		arg: res.dst
	// 	}
	// });
    //
	// alfy.output(result);
})
