import { Gatherer } from './Gatherer';

let g = new Gatherer();
console.log(g.po('q.po', './test/samples/**/*.js', 'gettext'));