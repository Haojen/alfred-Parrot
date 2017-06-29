'use strict';
const alfy = require('alfy');

const fetch = require('./script/config');
const {parrot} = require('./script/parrot_core');
let inputText = alfy.input ? alfy.input.trim() : ':okay';

const userWantPlaySound = parrot.userWantPlaySound(inputText);

if (userWantPlaySound) {
	// 截取语音标识符号
	inputText = inputText.slice(1);
}

const {queryText, targetLanguage} = parrot.getTransLanguage(inputText);

fetch.getTransitionResult(queryText, targetLanguage, 'youdao').then(res => {
	let result;

	if (res.query && res.web) {
		const web = res.web;
		const query = res.query;
		const basic = res.basic;
		const explainsDetail = basic?basic.explains.join(''):'';
		const explains = `; ${basic ? basic.phonetic : ''}`;

		res.translation.push(`[${explainsDetail}]`);

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
		// 非中译英，英译中的结果
		result = res.translation.map(trsItem => {
			return {
				title: trsItem,
				arg:trsItem,
			}
		})
	}

	alfy.output(result);

	// 播放声音
	userWantPlaySound ? parrot.playSound(res.translation[0]):null;
}, () => {
	fetch.getTransitionResult(queryText, targetLanguage, 'baidu').then(res => {
		let result = res.trans_result.map(res => {
			return {
				title: res.dst,
				subtitle: res.src,
				arg: res.dst,
			}
		});

		alfy.output(result);
		userWantPlaySound ? parrot.playSound(res.dst):null;
	}, err => {
		alfy.output([{
			title: err,
			arg: err
		}]);
	});
});
