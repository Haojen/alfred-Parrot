'use strict';
const alfy = require('alfy');

const fetch = require('./config');
const {parrot} = require('./parrot_core');
let inputText = alfy.input || ':你好';

const userWantPlaySound = parrot.userWantPlaySound(inputText);

if (userWantPlaySound) {
	inputText = inputText.slice(1);
}

const {queryText, targetLanguage} = parrot.getTransLanguage(inputText);

fetch.getTransitionResult(queryText, targetLanguage, 'youdao').then(res => {
	let result;

	// 如果有道无法进行翻译，则尝试调用百度接口
	if (res.errorCode !== '0'){
		fetch.getTransitionResult(queryText, targetLanguage, 'baidu').then(res => {
			result = res.trans_result.map(res => {
				return {
					title: res.dst,
					subtitle: res.src,
					arg: res.dst,
				}
			});
			if (userWantPlaySound) {
				parrot.playSound(res.dst);
			}
			alfy.output(result);
		});
	}else {
		if (res.query && res.web) {
			const web = res.web;
			const query = res.query;
			const basic = res.basic;
			const explainsDetail = basic?basic.explains.join(''):'';
			const explains = `; ${basic ? basic.phonetic : ''}`;

			res.translation.push(`[${explainsDetail}]`)

			web.unshift({
				value: res.translation,
				key: query + explains
			});

			result = web.map(trsItem => {
				let title = trsItem.value.join();
				return {
					title,
					subtitle: trsItem.key,
					arg: trsItem.value[0],
				}
			})
		}else {
			result = res.translation.map(trsItem => {
				return {
					title: trsItem,
					arg:trsItem,
				}
			})
		}

		if (userWantPlaySound) {
			parrot.playSound(res.translation[0]);
		}

		alfy.output(result);
	}

});
