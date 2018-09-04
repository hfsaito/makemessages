import * as fs from 'fs';

import { absolutePath } from '../../helpers/index';

import Gatherer from './Gatherer';

export default function(config) {

  let g = new Gatherer();
  Object.keys(config.languages).forEach(lang => {
  
    g.po(
      absolutePath(config.output) + `/${lang}.po`,
      absolutePath(config.input), 
      config.functions,
      lang,
      config.languages[lang],
      config.meta
    )
  });
};