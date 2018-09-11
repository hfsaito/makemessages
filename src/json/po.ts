import * as fs from 'fs';
import * as path from 'path';
import { PoFile } from '../po/index';
import Message from '../po/Message';

function compile(message: Message): { [index: string]: string } {

  let json: { [index: string]: string } = {};
  if (message.msgid) {

    let prefix = message.msgctxt?(message.msgctxt + '\x04'):'';
    let key = prefix + message.msgid, value = message.msgstr[0]?message.msgstr[0]:'';
    let keyPlural = prefix + message.msgid, valuePlural = message.msgstr[0]?message.msgstr[0]:'';
    
    key = key.replace(/\\n/g, '\u000a');
    keyPlural = keyPlural.replace(/\\n/g, '\u000a');
    value = value.replace(/\\n/g, '\u000a');
    valuePlural = valuePlural.replace(/\\n/g, '\u000a');
    json[key] = value;
    if (message.msgid_plural)
      json[keyPlural] = valuePlural;
  }
  return json;
}

export function jsonCompilePo(input: PoFile[], output: string): void {

  let json: { [index: string]: string } = {};
  input.forEach(f => {

    f.messages.forEach(m => { json = { ...json, ...compile(m) }; });
    // console.log(path.resolve(output, f.name.replace(/\.po$/g, '.json')));
    fs.writeFileSync(path.resolve(output, f.name.replace(/\.po$/g, '.json')), JSON.stringify(json,  null, 4));
  });
};