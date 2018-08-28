import * as fs from 'fs';

import { absolutePath } from '../../helpers/index';

import Gatherer from './Gatherer';

export default function(config) {

  let g = new Gatherer();
  Object.keys(config.languages).forEach(lang => {
  
    try {
      fs.statSync(absolutePath(config.output) + `/${lang}/`);
    } catch(e) {
      fs.mkdirSync(absolutePath(config.output) + `/${lang}/`);
    }
    g.po(
      absolutePath(config.output) + `/${lang}/locale.po`,
      absolutePath(config.input), 
      config.function,
      lang,
      config.languages[lang],
      config.meta
    )
  });
};