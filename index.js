'use strict';
const alfy = require('alfy');

const fetch = require('./script/config');
const {parrot} = require('./script/parrot_core');
const inputText = alfy.input ? alfy.input.trim() : ':okay';

const {queryText, targetLanguage, isPlaySound} = parrot.getTransLanguage(inputText);

parrot.getTransitionResult(queryText, targetLanguage, 'youdao').then(res => {
	//有道的查询结果
	let result;

	if (res.query && res.web) {
		const web = res.web;
		const query = res.query;
		const basic = res.basic;
		const explainsDetail = basic ? basic.explains.join('') : '';
		const explains = `;${basic ? basic.phonetic : ''}`;

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
	isPlaySound ? parrot.playSound(res.translation[0]):null;
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
		isPlaySound ? parrot.playSound(res.dst):null;
	}, err => {
		alfy.output([{
			title: err,
			arg: err
		}]);
	});
});
