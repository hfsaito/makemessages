import * as cli from 'cli';
import * as path from 'path';
import { Gatherer as POGatherer } from './Gatherers/po/index';

let args = cli.parse({
	config: [ 'c', 'A json file with your configurations', 'file', './makemessages.json' ]
});

async function main() {

	const config = await import(path.resolve(process.cwd(), args.config)).catch(console.error);
	if (!config)
		return;

	if (!config.outputs)
		throw new Error("missing \"outputs\" in config.json file");

	if (config.outputs.po) {

		let output = Object.assign(config.outputs.any?config.outputs.any:{}, config.outputs.po);
		let meta = (config.meta && config.meta.po)?config.meta.po:undefined;
		let g = new POGatherer();
		Object.keys(output.languages).forEach(lang => {
	
			g.po(
				path.resolve(process.cwd(), output.dest, `${output.fileName.replace(/\[lang\]/g, lang)}.po`),
				path.resolve(process.cwd(), output.src), 
				'gettext',
				lang,
				output.languages[lang],
				meta
			);
		});
	}
}

main();