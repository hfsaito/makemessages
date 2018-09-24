import * as fs from 'fs';
import * as path from 'path';

import { PoMessage, PoFile } from '../po/index';

function jsonFromPoMessage(message: PoMessage): { [index: string]: string } {

  let json: { [index: string]: string } = {};
  if (message.msgid) {

    let prefix = message.msgctxt?(message.msgctxt + '\x04'):'';
    let key = prefix + message.msgid, value = message.msgstr[0]?message.msgstr[0]:message.msgid;
    let keyPlural = prefix + message.msgid_plural, valuePlural = message.msgstr[1]?message.msgstr[1]:message.msgid_plural;
    
    key = key.replace(/\\n/g, '\u000a');
    keyPlural = keyPlural.replace(/\\n/g, '\u000a');
    value = value.replace(/\\n/g, '\u000a');
    valuePlural = valuePlural.replace(/\\n/g, '\u000a');
    json[key] = value;
    if (message.msgid_plural.length > 0)
      json[keyPlural] = valuePlural;
  }
  return json;
};

export function jsonFromPo(file: PoFile): { [index: string]: string } {

  let json: { [index: string]: string } = {};
  file.messages.forEach(m => { json = { ...json, ...jsonFromPoMessage(m) }; });
  return json;
}

export function jsonPo(input: PoFile[], output): void {

  input.forEach(f => {

    let content: string = JSON.stringify(jsonFromPo(f), null, 4);
    fs.writeFileSync(path.resolve(output.target, f.name.replace(/\.po$/g, '.json')), content);
  });
};