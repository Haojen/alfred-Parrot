const alfy = require('alfy');

const {parrot} = require('./script/parrot_core');
const inputText = alfy.input ? alfy.input.trim() : ':debug';

parrot.getTransLanguage(inputText, result => alfy.output(result)
);
