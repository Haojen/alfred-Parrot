'use strict';
const alfy = require('alfy');

const fetch = require('./config');
const {parrot} = require('./parrot_core');
const inputText = alfy.input || 'lol';

const {queryText, targetLanguage} = parrot.getTransLanguage(inputText);

fetch.getTransitionResult(queryText, targetLanguage, 'youdao').then(res => {
	// console.log(res.web, '返回的翻译结果', res)
	// let result = res.trans_result.map(res => {
	// 	return {
	// 		title: res.dst,
	// 		subtitle: res.src,
	// 		arg: res.dst
	// 	}
	// });
    //

	if (res.errorCode !== '0'){
		//todo 错误处理
		return
	}

	const web = res.web;
	const query = res.query;
	const explains = res.basic.explains.reduce((a, b) => a+','+b);
	const basic = `解释：${explains}, 拼读：${res.basic.phonetic||'无'}`

	res.translation.push(basic)

	web.unshift({
		value: res.translation,
		key: query
	});

	let result = web.map(trsItem => {
		let title = trsItem.value.reduce((a,b) => a+','+b)
		return {
			title,
			subtitle: trsItem.key,
			arg: trsItem.value[0]
		}
	})

	// console.log(result)
    //
    alfy.output(result);
})
