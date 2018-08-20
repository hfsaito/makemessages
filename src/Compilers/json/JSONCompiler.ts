import * as fs from 'fs';
import { POMessage, POReader } from '../../Gatherers/po/index';

export class JSONCompiler {

  private poreader = new POReader();
  
  po2json(fileInput: string, fileOutput: string): void {

    let messages: POMessage[] = this.poreader.read(fileInput);
    let json: { [index: string]: string } = {};
    messages.forEach(m => {
      
      json = Object.assign(json, m.json);
    });
    fs.writeFileSync(fileOutput, JSON.stringify(json,  null, 4));
  }
}