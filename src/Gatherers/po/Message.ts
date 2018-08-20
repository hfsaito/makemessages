export class POMessage {

  constructor (public msgid: string, public msgstr: string[] = [''], public comments: string[] = [], public msgctxt: string = '', public msgid_plural: string = ''){}

  private msgPotFormat(msg: string): string {

    msg = msg?msg:'';
    if (/\\n/g.test(msg))
      return `""\n${msg.split('\\n').map((m, i, l) => { 
        
        if (i < (l.length - 1))
          return `"${m}\\n"`;
        if (m.length > 0)
          return `"${m}"`;
        return '';
      }).filter(m => m.length > 0).join('\n')}`;
    return `"${msg}"`
  }

  get commentsPot(): string {

    if (this.comments)
      return this.comments.map(comment => `# ${comment}\n`).join('');
    return '';
  }

  get msgctxtPot(): string {

    if (this.msgctxt)
      return `msgctxt ${this.msgPotFormat(this.msgctxt)}\n`;
    return '';
  }

  get msgidPot(): string {

    return `msgid ${this.msgPotFormat(this.msgid)}\n`;
  }

  get msgid_pluralPot(): string {

    if (this.msgid_plural)
      return `msgid_plural ${this.msgPotFormat(this.msgid_plural)}\n`;
    return '';
  }

  get msgstrPot(): string {

    if (this.msgid_plural)
      return `msgstr[0] ${this.msgPotFormat(this.msgstr[0])}\nmsgstr[1] ${this.msgPotFormat(this.msgstr[1])}\n`
    return `msgstr ${this.msgPotFormat(this.msgstr[0])}\n`;
  }

  get pot(): string {

    let pot = '';
    pot += this.commentsPot;
    pot += this.msgctxtPot;
    pot += this.msgidPot;
    pot += this.msgid_pluralPot;
    pot += this.msgstrPot;
    return pot;
  }

  get json(): { [index: string]: string } {

    let json: { [index: string]: string } = {};
    if (this.msgid) {

      let prefix = this.msgctxt?(this.msgctxt + '\x04'):'';
      let key = prefix + this.msgid, value = this.msgstr[0]?this.msgstr[0]:'';
      let keyPlural = prefix + this.msgid, valuePlural = this.msgstr[0]?this.msgstr[0]:'';
      
      key = key.replace(/\\n/g, '\u000a');
      keyPlural = keyPlural.replace(/\\n/g, '\u000a');
      value = value.replace(/\\n/g, '\u000a');
      valuePlural = valuePlural.replace(/\\n/g, '\u000a');
      json[key] = value;
      if (this.msgid_plural)
        json[keyPlural] = valuePlural;
    }
    return json;
  }
};