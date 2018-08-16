import { POReader } from '../helpers/index';
import { Message } from '../models/index';
import * as fs from 'fs';

export class POCompiler {

  private poreader = new POReader();
  
  po2json(fileInput: string, fileOutput: string): void {

    let messages: Message[] = this.poreader.read(fileInput);
    let json: { [index: string]: string } = {};
    messages.forEach(m => {
      
      json = Object.assign(json, m.json);
    });
    fs.writeFileSync(fileOutput, JSON.stringify(json,  null, 4));
  }
}