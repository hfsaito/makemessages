import * as cli from 'cli';
import { Gatherer } from './Gatherer';
import { POCompiler } from './Compiler/index';


// const [,, ...rawargs] = process.argv.reduce((acc, arg) => Object.assign(acc, { arg.split('=')[0]: arg.split('=')[1] }), {});
// console.log(rawargs);
let args = cli.parse({
	config: [ 'c', 'A json file with your configurations', 'file', './makemessages.json' ] // ,          // -f, --file FILE   A file to process
	// time: [ 't', 'An access time', 'time', false],                 // -t, --time TIME   An access time
	// work: [ false, 'What kind of work to do', 'string', 'sleep' ]  //     --work STRING What kind of work to do
});
import(args.config).catch(err => cli.error(err));
console.log(args);

let g = new Gatherer();
g.po('./test/samples/locale.po', './test/samples/**/*.js', 'gettext');

let c = new POCompiler();
c.po2json('./test/samples_toignore/q.po', './test/samples_toignore/q.json');