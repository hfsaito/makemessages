import * as fs from 'fs';
import * as glob from 'glob';
import { POReader } from './helpers/index';
import { Message } from './models/Message';

export class Gatherer {

  private poreader = new POReader();

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

  public mergeMessages(oldMessages: Message[], newMessages: Message[]): Message[] {

    let mergedMessages:Message[] = oldMessages;

    newMessages.forEach(msg => {

      if (!mergedMessages.some(m => m.msgctxt == msg.msgctxt && (m.msgid == msg.msgid || (m.msgid_plural == msg.msgid_plural && msg.msgid_plural.length > 0))))
        mergedMessages.push(msg);
    });
    
    return mergedMessages;
  }

  public po(filePath: string, filesPattern: string, gettextWrapper: string | RegExp): void {

    let old_msgids: Message[] = [];
    let new_msgids: Message[] = this.gather(filesPattern, gettextWrapper);
    if (fs.existsSync(filePath))
      old_msgids = this.poreader.read(filePath)

    fs.writeFileSync('./test/samples_toignore/q.po', this.mergeMessages(old_msgids, new_msgids).map(msg => msg.pot).join('\n'));
  }
};