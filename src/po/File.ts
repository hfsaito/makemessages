import * as path from 'path';

import { fDatetime } from '../helpers/index';

import { PoMessage } from './index';

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

function headerTemplate(languageCode, languageName, meta): POHeader {

  let resp: POHeader = {
    comments: [
      `Translation file for ${languageName.toLowerCase()}.`,
    ],
    contents: {
      "Project-Id-Version": `${(meta && meta["Project-Id-Version"]) ? meta["Project-Id-Version"] : "0.0.1"}`,
      "Report-Msgid-Bugs-To": `${(meta && meta["Report-Msgid-Bugs-To"]) ? meta["Report-Msgid-Bugs-To"] : ""}`,
      "POT-Creation-Date": fDatetime(new Date()),
      "PO-Revision-Date": "",
      "Last-Translator": "",
      "Language-Team": `${(meta && meta["Language-Team"]) ? meta["Language-Team"] : ""}`,
      "Language": `${languageCode}`,
      "MIME-Version": "1.0",
      "Content-Type": "text/plain; charset=UTF-8",
      "Content-Transfer-Encoding": "8bit",
      "Plural-Forms": "nplurals=2; plural=(n > 1);"
    }
  };

  if (meta) {

    if (meta.copyright) {

      resp.comments.push(`Copyright (C) ${(new Date).getFullYear()}'s ${meta.copyright.domain}`);
      resp.comments.push(`This file is distributed under the same license as the ${meta.copyright.package} package.`);
    }

    if (meta.maintainer)
      resp.comments.push(`${meta.maintainer.name} <${meta.maintainer.email}>, ${(new Date).getFullYear()}.`);
  }
  resp.comments.push("");

  return resp;
};

export class PoFile {

  readonly name: string;
  readonly messages: PoMessage[];

  constructor(messages: PoMessage[], name?: string) {

    this.messages = messages;
    let headerMergedDefault: POHeader = {
      comments: this.header.comments.length ? this.header.comments : headerDefault.comments,
      contents: Object.assign(headerDefault.contents, this.header.contents)
    }
    this.header = headerMergedDefault;
    this.name = name ? path.basename(name) : '';
  }

  merge(newfile: PoFile): PoFile {

    let mergedMessages: PoMessage[] = this.messages;

    newfile.messages.forEach(msg => {

      if (!mergedMessages.some(m => m.msgctxt == msg.msgctxt && (m.msgid == msg.msgid || (m.msgid_plural == msg.msgid_plural && msg.msgid_plural.length > 0))))
        mergedMessages.push(msg);
    });

    return new PoFile(mergedMessages);
  };

  generate(langauge_code?: string, language_name?: string, meta?: Object, keepOld: boolean = true): string {

    let header = this.header;
    let defaultHeader = headerTemplate(langauge_code, language_name, meta);
    defaultHeader.contents["PO-Revision-Date"] = header.contents["PO-Revision-Date"];
    defaultHeader.contents["Last-Translator"] = header.contents["Last-Translator"];
    this.header = defaultHeader;
    return this.messages.map(msg => msg.pot(keepOld)).join('\n');
  }

  get header(): POHeader {

    let msgHeader: PoMessage = this.messages.find(msg => msg.msgid == '');
    let resp: POHeader = { comments: [], contents: {} };
    if (!msgHeader)
      msgHeader = new PoMessage('');

    msgHeader.msgstr[0]
      .split('\\n')
      .map(ss => ss.split(': '))
      .forEach(headOpt => resp.contents[headOpt[0]] = headOpt[1] ? headOpt[1] : '');
    resp.comments = msgHeader.comments;

    return resp;
  }

  set header(newheader: POHeader) {

    let msgHeader: PoMessage = this.messages.find(msg => msg.msgid == '');
    if (msgHeader)
      this.messages.splice(this.messages.findIndex(msg => msg.msgid == ''), 1);
    this.messages.splice(0, 0, new PoMessage(
      '',
      [Object.keys(newheader.contents).filter(headerOpt => headerOpt).map(headerOpt => `${headerOpt}: ${newheader.contents[headerOpt]}`).join('\\n') + '\\n'],
      newheader.comments
    ))
  }
};