import { POMessage } from './index';

interface POHeader {
  comments: string[];
  contents: { [index: string]: string };
};

const headerDefault: POHeader = {
  comments: [
    "Translation file for brazilian portuguese.",
    "Copyright (C) 2018'S example.com",
    "This file is distributed under the same license as the example package.",
    "Developer <example@email.com>, 2018.",
    ""
  ],
  contents: {
    "Project-Id-Version": "0.0.1",
    "Report-Msgid-Bugs-To": "",
    "POT-Creation-Date": "",
    "PO-Revision-Date": "",
    "Last-Translator": "",
    "Language-Team": "",
    "Language": "",
    "MIME-Version": "1.0",
    "Content-Type": "text/plain; charset=UTF-8",
    "Content-Transfer-Encoding": "8bit",
    "Plural-Forms": "nplurals=2; plural=(n > 1);"
  }
};

export class POFile {

  readonly messages: POMessage[];

  constructor(messages: POMessage[], header?: { [index: string]: string }){

    this.messages = messages;
    let headerMergedDefault: POHeader = {
      comments: this.header.comments.length?this.header.comments:headerDefault.comments,
      contents: Object.assign(headerDefault.contents, this.header.contents)
    }
    this.header = headerMergedDefault;
  }

  merge(newfile: POFile): POFile {

    let mergedMessages:POMessage[] = this.messages;
  
    newfile.messages.forEach(msg => {
  
      if (!mergedMessages.some(m => m.msgctxt == msg.msgctxt && (m.msgid == msg.msgid || (m.msgid_plural == msg.msgid_plural && msg.msgid_plural.length > 0))))
        mergedMessages.push(msg);
    });
      
    return new POFile(mergedMessages);
  };

  get content(): string {

    let header = this.header, now = new Date();
    header.contents["POT-Creation-Date"] = `${now.getFullYear()}-${('0' + (now.getMonth()+1)).slice(-2)}-${('0' + now.getDate()).slice(-2)} ${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}`;
    header.contents["POT-Creation-Date"] += `${now.getTimezoneOffset() <= 0?'+':'-'}${('0' + Math.round(Math.abs(now.getTimezoneOffset())/60)).slice(-2)}${('0' + Math.round(Math.abs(now.getTimezoneOffset())%60)).slice(-2)}`;
    this.header = header;
    return this.messages.map(msg => msg.pot).join('\n');
  }

  get header(): POHeader {

    let msgHeader: POMessage = this.messages.find(msg => msg.msgid == '');
    let resp: POHeader = { comments: [], contents: {} };
    if (!msgHeader)
      msgHeader = new POMessage('');

    msgHeader.msgstr[0]
      .split('\\n')
      .map(ss => ss.split(': '))
      .forEach(headOpt => resp.contents[headOpt[0]] = headOpt[1]?headOpt[1]:'');
    resp.comments = msgHeader.comments;

    return resp;
  }

  set header(newheader: POHeader) {

    let msgHeader: POMessage = this.messages.find(msg => msg.msgid == '');
    if (msgHeader)
      this.messages.splice(this.messages.findIndex(msg => msg.msgid == ''), 1);
    this.messages.splice(0, 0, new POMessage(
      '',
      [ Object.keys(newheader.contents).filter(headerOpt => headerOpt).map(headerOpt => `${headerOpt}: ${newheader.contents[headerOpt]}`).join('\\n') + '\\n' ],
      newheader.comments
    ))
  }
};