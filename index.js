const alfy = require('alfy');
const {parrot} = require('./script/parrot_core');

if (process.env.NODE_ENV === 'development') {
	const textInput = ':Debug';
	parrot.getTransLanguage(textInput, result => console.log(result));

	return;
}

parrot.getTransLanguage(alfy.input.trim(), result => alfy.output(result));
