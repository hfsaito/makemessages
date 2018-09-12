import * as fs from 'fs';
import * as path from 'path';

import { PoFile } from '../po/index';
import { jsonFromPo } from '../json/index';

import { template } from './template';

export function javascriptPo(input: PoFile[], output): void {

  input.forEach(f => {

    let content: string = template(output.functions, jsonFromPo(f));
    if (output.minify)
      content = content.replace(/\s/g, "");
    fs.writeFileSync(path.resolve(output.target, f.name.replace(/\.po$/g, '.js')), content);
  });
};