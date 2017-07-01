const env = process.env;
/*
baidu
* appid:'20170625000060222'
* key: '2dlAYT1dFruhnrQj7yWL'
* */
let user_yd = {
	key: '',
	appid: ''
};

let user_bd = {
	key: '',
	appid: ''
};

if (env.config_youdao) {
	user_yd = JSON.parse(env.config_youdao);
}
if (env.config_baidu) {
	user_bd = JSON.parse(env.config_baidu);
}

const config = {
	youdao: {
		url: 'https://openapi.youdao.com/api',
		appid: user_yd.appid,
		key: user_yd.key,
		salt: 1039057373
	},
	baidu: {
		url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
		appid: user_bd.appid,
		key: user_bd.key,
		salt: 1039057373
	}
};

module.exports = config;
