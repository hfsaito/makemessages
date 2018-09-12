import * as fs from 'fs';
import * as glob from 'glob';

import { absolutePath, findAll, RegexNamedGroups } from '../helpers/index';

import { PoMessage, PoFile, poRead } from './index';

function getSource(pattern: string): string {

  return glob.sync(pattern).map(fileName => fs.readFileSync(fileName, 'utf-8')).join('\n\n');
}

function readSource(filesPattern: string, functionWrappers: RegexNamedGroups[]): PoMessage[] {

  let source = getSource(filesPattern);
  let response: PoMessage[] = [];

  functionWrappers.forEach(fw => {

    let messages = findAll(source, fw);
    response = response.concat(messages.map(m => {

      let context = m[fw.getGroupIndex("context")];
      let singular = m[fw.getGroupIndex("singular")];
      let plural = m[fw.getGroupIndex("plural")];
      // let number = m[fw.getGroupIndex("number")];
      return new PoMessage(singular, [], [], context?context:"", plural?plural:"");
    }))
  });

  return response;
};

export function poGather(config) {

  Object.keys(config.languages).forEach(lang => {
  
    let filePath: string = absolutePath(config.output) + `/${lang}.po`;
    let filesPattern: string = absolutePath(config.input);
    let functionWrappers: RegexNamedGroups[] = config.functions.map((f) => new RegexNamedGroups(f, "g"));
    let language_code: string = lang;
    let language_name: string = config.languages[lang];
    let meta: Object = config.meta;
  
    let oldfile: PoFile = poRead(filePath);
    let newfile: PoFile = new PoFile(readSource(filesPattern, functionWrappers));

    fs.writeFileSync(filePath, oldfile.merge(newfile).generate(language_code, language_name, meta));
  });
};