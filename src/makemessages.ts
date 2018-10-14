import * as cli from 'cli';

import { absolutePath } from './helpers/index';

import { makemessages } from './index';

let args = cli.parse({
	config: ['c', 'A json file with your configurations', 'file', './makemessages.json']
});

const defaultConfig = {
	"type": "po",
	"input": "",
	"output": "",
	"functions": [
		"(?:^|[^$\\w\\s.])\\s*gettext\\s*\\(\\s*['\"](?<singular>.*?)['\"]\\s*\\)",
		"(?:^|[^$\\w\\s.])\\s*pgettext\\s*\\(\\s*['\"](?<context>.*?)['\"]\\s*,\\s*['\"](?<singular>.*?)['\"]\\s*\\)",
		"(?:^|[^$\\w\\s.])\\s*ngettext\\s*\\(\\s*['\"](?<singular>.*?)['\"]\\s*,\\s*['\"](?<plural>.*?)['\"]\\s*,\\s*(?<number>\\d*)\\s*\\)",
		"(?:^|[^$\\w\\s.])\\s*npgettext\\s*\\(\\s*['\"](?<context>.*?)['\"]\\s*,\\s*['\"](?<singular>.*?)['\"]\\s*,\\s*['\"](?<plural>.*?)['\"]\\s*,\\s*(?<number>\\d*)\\s*\\)"
	],
	"languages": {
		"en": "English",
	},
	"keepOldMessages": true,
	"meta": {
		"copyright": {
			"domain": "example.com",
			"package": "example"
		},
		"maintainer": {
			"name": "Developer",
			"email": "developer@example.com"
		},
		"Project-Id-Version": "0.0.1",
		"Report-Msgid-Bugs-To": "developer@example.com",
		"Language-Team": "Team Example"
	}
};

async function main() {

	var configs = await import(absolutePath(args.config)).catch(console.error);
	if (!configs)
		return;

	if (configs instanceof Array)
		configs = configs.map(c => ({ ...defaultConfig, ...c }));
	else
		configs = [{ ...defaultConfig, ...configs }];

	makemessages(configs);
}

main();