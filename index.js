'use strict';
const alfy = require('alfy');

const fetch = require('./config');
const {parrot} = require('./parrot_core');
const inputText = alfy.input || 'Debug';

const {queryText, targetLanguage} = parrot.getTransLanguage(inputText);

fetch.getTransitionResult(queryText, targetLanguage, 'youdao').then(res => {
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
