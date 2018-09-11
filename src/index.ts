import { poGather } from './po/index';

export function makemessages(configs) {

	configs.forEach(config => {

		switch(config.type) {
		case 'po':
			poGather(config);
			break;
		default: 
			throw new Error("Invalid configuration type, expected: po");
		}
	});
};

import { poReadMultiple, PoFile } from './po/index';
import { jsonPo } from './json/index';

export function compilemessages(configs) {

	configs.forEach(config => {
		
		let input: PoFile[];
		switch(config.input.type) {
		case 'po':
			input = poReadMultiple(config.input.target);
			break;
		default: 
			throw new Error("Invalid configuration type, expected: po");
		}

		switch(config.output.type) {
		case 'javascript':
			// javascriptCreate(config.output.target);
			break;
		case 'json':
			jsonPo(input, config.output.target); // jsonCreate(config.output.target);
			break;
		default: 
			throw new Error("Invalid configuration type, expected: javascript or json");
		}

		// const c = new PO2JSONCompiler();
		// let inputOutputDict = {};
		// glob.sync(absolutePath(config.input.target)).forEach(file => {
			
		// 	inputOutputDict[file] = file.replace(absolutePath(config.json.input), absolutePath(config.json.output)).replace(/\.po$/g, '.json');
		// });
		// Object.keys(inputOutputDict).forEach(input => {
			
		// 	try {
		// 		fs.statSync(path.dirname(inputOutputDict[input]));
		// 	} catch(e) {
		// 		fs.mkdirSync(path.dirname(inputOutputDict[input]));
		// 	}
		// 	c.po2json(input, inputOutputDict[input])
		// });
	});
};