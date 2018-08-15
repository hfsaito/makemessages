import { Gatherer } from './Gatherer';

let g = new Gatherer();
console.log(g.po('./test/samples/locale.po', './test/samples/**/*.js', 'gettext'));