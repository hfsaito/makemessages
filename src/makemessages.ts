import * as cli from 'cli';
import { absolutePath } from './helpers/index';
import * as Gatherers from './Gatherers/index';

let args = cli.parse({
	config: [ 'c', 'A json file with your configurations', 'file', './makemessages.json' ]
});

async function main() {

	const configs = await import(absolutePath(args.config)).catch(console.error);
	if (!configs)
		return;

	configs.forEach(config => {

		switch(config.type) {
		case 'po':
			Gatherers.po(config);
			break;
		default:
			throw new Error("Invalid configuration type, expected: po");
		}
	});
}

main();