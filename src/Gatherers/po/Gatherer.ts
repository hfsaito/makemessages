import * as fs from 'fs';
import * as glob from 'glob';
import { POFile, POMessage, POReader } from './index';

export class Gatherer {

  private poreader = new POReader();

  private __getSource(pattern: string): string {

    return glob.sync(pattern).map(fileName => fs.readFileSync(fileName, 'utf-8')).join('\n\n');
  }

  public gather(filesPattern: string, gettextWrapper: string | RegExp): POMessage[] {

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
    return Array.from(new Set(res)).map(msgid => new POMessage(msgid));
  }

  public po(
    filePath: string,
    filesPattern: string,
    gettextWrapper: string | RegExp,
    language_code: string,
    language_name: string,
    meta: Object
  ): void {

    let oldfile: POFile;
    let newfile: POFile = new POFile(this.gather(filesPattern, gettextWrapper));
    oldfile = new POFile(fs.existsSync(filePath)?this.poreader.read(filePath):[]);

    fs.writeFileSync(filePath, oldfile.merge(newfile).generate(language_code, language_name, meta));
  }
};