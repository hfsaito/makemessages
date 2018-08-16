import { Gatherer } from './Gatherer';
import { POCompiler } from './Compiler/index';

let g = new Gatherer();
g.po('./test/samples/locale.po', './test/samples/**/*.js', 'gettext');

let c = new POCompiler();
c.po2json('./test/samples_toignore/q.po', './test/samples_toignore/q.json');