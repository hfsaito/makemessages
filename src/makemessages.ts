import * as cli from 'cli';
import { absolutePath } from './helpers/index';
import { makemessages } from './index';

let args = cli.parse({
	config: [ 'c', 'A json file with your configurations', 'file', './makemessages.json' ]
});

async function main() {

	const configs = await import(absolutePath(args.config)).catch(console.error);
	if (!configs)
		return;

	makemessages(configs);
}

main();