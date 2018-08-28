import * as fs from 'fs';
import Message from '../../../Gatherers/po/Message';
import Reader from '../../../Gatherers/po/Reader';

export class PO2JSONCompiler {

  private poreader = new Reader();
  
  po2json(fileInput: string, fileOutput: string): void {

    let messages: Message[] = this.poreader.read(fileInput);
    let json: { [index: string]: string } = {};
    messages.forEach(m => {
      
      json = Object.assign(json, this.json(m));
    });
    fs.writeFileSync(fileOutput, JSON.stringify(json,  null, 4));
  }

  json(message: Message): { [index: string]: string } {

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