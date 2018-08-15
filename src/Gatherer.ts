import * as fs from 'fs';
import * as glob from 'glob';

class Message {
  // comments: string;
  // msgctx: string;
  // msgid: string;
  // msgid_plural: string;
  // msgstr: string; //[];

  constructor(public msgid: string, public msgstr: string = ""){}

  toString(): string{

    return `msgid "${this.msgid}"\nmsgstr "${this.msgstr}"\n`;
  }
}

export class Gatherer {

  private __getSource(pattern: string): string {

    return glob.sync(pattern).map(fileName => fs.readFileSync(fileName, 'utf-8')).join('\n\n');
  }

  public gather(filesPattern: string, gettextWrapper: string | RegExp): Message[] {

    let source = this.__getSource(filesPattern);
    let re: RegExp; // = /\$t\(['"].*?['"]\)/g.exec(file);
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

  public readPo(filePath: string): Message[] {

    let source = fs.readFileSync(filePath, 'utf-8');
    let re = /msgid ".*"\s+msgstr ".*"/g;
    // let re = /msgid ".*"\s+(?:msgid_plural ".*"\s+)?msgstr ".*"/g;
    let msgsRaw: string[] = [];

    do {
      var m = re.exec(source);
      if (m)
        msgsRaw.push(m[0]);
    } while (m);

    return msgsRaw.map(msgRaw => {
      let msgid = /msgid "(.*)"/g.exec(msgRaw)[1];
      let msgstr = /msgstr "(.*)"/g.exec(msgRaw)[1];

      return new Message(msgid, msgstr);
    });
  }

  public mergeMessages(oldMessages: Message[], newMessages: Message[]): Message[] {

    let localesJson: { [index:string]: string } = {};
    oldMessages.forEach(msg => localesJson[msg.msgid] = msg.msgstr);
    newMessages.forEach(msg => localesJson[msg.msgid] = localesJson[msg.msgid]?localesJson[msg.msgid]:msg.msgstr);

    return Object.keys(localesJson).map(msgid => new Message(msgid, localesJson[msgid]));
  }

  public po(filePath: string, filesPattern: string, gettextWrapper: string | RegExp): void {

    let old_msgids: Message[] = [];
    let new_msgids: Message[] = this.gather(filesPattern, gettextWrapper);
    if (fs.existsSync(filePath))
      old_msgids = this.readPo(filePath)

    console.log(old_msgids);
    console.log(new_msgids);
    fs.writeFileSync(filePath, this.mergeMessages(old_msgids, new_msgids).join('\n'));
  }
};