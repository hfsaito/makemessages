import { poGather } from './po/index';

export function makemessages(configs) {

	configs.forEach(config => {

		switch (config.type) {
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
import { javascriptPo } from './javascript/index';

export function compilemessages(configs) {

	configs.forEach(config => {

		let input: PoFile[];
		switch (config.input.type) {
			case 'po':
				input = poReadMultiple(config.input.target);
				break;
			default:
				throw new Error("Invalid configuration type, expected: po");
		}

		switch (config.output.type) {
			case 'javascript':
				javascriptPo(input, config.output);
				break;
			case 'json':
				jsonPo(input, config.output); // jsonCreate(config.output.target);
				break;
			default:
				throw new Error("Invalid configuration type, expected: javascript or json");
		}
	});
};