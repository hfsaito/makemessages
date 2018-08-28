import * as fs from 'fs';
import * as glob from 'glob';
import Message from './Message';
import File from './File';
import Reader from './Reader';

export default class Gatherer {

  private poreader = new Reader();

  private __getSource(pattern: string): string {

    return glob.sync(pattern).map(fileName => fs.readFileSync(fileName, 'utf-8')).join('\n\n');
  }

  public gather(filesPattern: string, gettextWrapper: string | RegExp): Message[] {

    let source = this.__getSource(filesPattern);
    let re: RegExp;
    let res: string[] = [];

    if (typeof gettextWrapper === "string")
      re = new RegExp(gettextWrapper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + /\(['"](.*?)['"]\)/.source, 'g');
    else
      re = new RegExp(gettextWrapper.source + /\(['"](.*?)['"]\)/.source, 'g');

    do {
      var m = re.exec(source);
      if (m)
        res.push(m.reverse()[0]);
    } while (m);
    return Array.from(new Set(res)).map(msgid => new Message(msgid));
  }

  public po(
    filePath: string,
    filesPattern: string,
    gettextWrapper: string | RegExp,
    language_code: string,
    language_name: string,
    meta: Object
  ): void {

    let oldfile: File;
    let newfile: File = new File(this.gather(filesPattern, gettextWrapper));
    oldfile = new File(fs.existsSync(filePath)?this.poreader.read(filePath):[]);

    fs.writeFileSync(filePath, oldfile.merge(newfile).generate(language_code, language_name, meta));
  }
};