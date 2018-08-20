import * as fs from 'fs';
import { POMessage, POReader } from '../../../Gatherers/po/index';

export class PO2JSONCompiler {

  private poreader = new POReader();
  
  po2json(fileInput: string, fileOutput: string): void {

    let messages: POMessage[] = this.poreader.read(fileInput);
    let json: { [index: string]: string } = {};
    messages.forEach(m => {
      
      json = Object.assign(json, this.json(m));
    });
    fs.writeFileSync(fileOutput, JSON.stringify(json,  null, 4));
  }

  json(message: POMessage): { [index: string]: string } {

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
};