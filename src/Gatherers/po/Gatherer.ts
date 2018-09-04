import * as fs from 'fs';
import * as glob from 'glob';
import Message from './Message';
import File from './File';
import Reader from './Reader';
import { findAll, RegexNamedGroups } from '../../helpers/index';

export default class Gatherer {

  private poreader = new Reader();

  private __getSource(pattern: string): string {

    return glob.sync(pattern).map(fileName => fs.readFileSync(fileName, 'utf-8')).join('\n\n');
  }

  public gather(filesPattern: string, functionWrappers: RegexNamedGroups[]): Message[] {

    let source = this.__getSource(filesPattern);
    let response: Message[] = [];

    functionWrappers.forEach(fw => {

      let messages = findAll(source, fw);
      response = response.concat(messages.map(m => {

        let context = m[fw.getGroupIndex("context")];
        let singular = m[fw.getGroupIndex("singular")];
        let plural = m[fw.getGroupIndex("plural")];
        // let number = m[fw.getGroupIndex("number")];
        return new Message(singular, [], [], context?context:"", plural?plural:"");
      }))
    });

    return response;
  }

  public po(
    filePath: string,
    filesPattern: string,
    functionWrappers: RegexNamedGroups[],
    language_code: string,
    language_name: string,
    meta: Object
  ): void {

    let oldfile: File;
    let newfile: File = new File(this.gather(filesPattern, functionWrappers));
    oldfile = new File(fs.existsSync(filePath)?this.poreader.read(filePath):[]);

    fs.writeFileSync(filePath, oldfile.merge(newfile).generate(language_code, language_name, meta));
  }
};