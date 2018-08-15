import * as fs from 'fs';
import { findAll } from '../Helpers/RegExpAll';
import { Message } from '../Message';

export class POReader {

  private messageRE = /(?:#.*\n)*(?:msgctxt (?:".*"\n)+)?msgid (?:".*"\n)+(?:msgid_plural (?:".*"\n)+)?(?:msgstr(?:\[\d+\])? (?:".*"\n?)+)+/g;
  private commentsRE = /#.*/g;
  private msgctxtRE = /msgctxt ((?:"(?:.*?(?:\\")?.*?)*?"\n?)+)/g;
  private msgidRE = /msgid ((?:"(?:.*?(?:\\")?.*?)*?"\n?)+)/g;
  private msgid_pluralRE = /msgid_plural ((?:"(?:.*?(?:\\")?.*?)*?"\n?)+)/g;
  private msgstrRE = /msgstr(?:\[\d+\])? ((?:"(?:.*?(?:\\")?.*?)*?"\n?)+)/g;

  private grabRawMessages(fileContent: string): string[]{

    this.messageRE.lastIndex = 0;
    return findAll(fileContent, this.messageRE).map(m => m[0]);
  }

  private grabComments(rawMessage: string): string[] {

    this.commentsRE.lastIndex = 0;
    return findAll(rawMessage, this.commentsRE).map(m => m[0].slice(1));
  }

  private grabMsgctxt(rawMessage: string): string {

    this.msgctxtRE.lastIndex = 0;
    let msgctxt_match = this.msgctxtRE.exec(rawMessage);
    if (msgctxt_match)
      return msgctxt_match[1].split('\n').map(msg => msg.slice(1, -1)).join('');
    return '';
  }

  private grabMsgid(rawMessage: string): string {

    this.msgidRE.lastIndex = 0;
    return this.msgidRE.exec(rawMessage)[1].split('\n').map(msg => msg.slice(1, -1)).join('');
  }

  private grabMsgid_plural(rawMessage: string): string {

    this.msgid_pluralRE.lastIndex = 0;
    let msgid_plural_match = this.msgid_pluralRE.exec(rawMessage);
    if (msgid_plural_match)
      return msgid_plural_match[1].split('\n').map(msg => msg.slice(1, -1)).join('');
    return '';
  }


  private grabMsgstr(rawMessage: string): string[] {

    return findAll(rawMessage, this.msgstrRE).map(m => m[1].split('\n').filter(msg => msg.length > 0).map(msg => msg.slice(1, -1)).join(''));
  }

  private buildMessages(rawMessages: string[]): Message[]{

    return rawMessages.map(raw => {

      let comments: string[] = this.grabComments(raw);
      let msgctxt: string = this.grabMsgctxt(raw);
      let msgid: string = this.grabMsgid(raw);
      let msgid_plural: string = this.grabMsgid_plural(raw);
      let msgstr = this.grabMsgstr(raw);

      return new Message(msgid, msgstr, comments, msgctxt, msgid_plural);
    });
  }

  read(file: string): Message[]{

    return this.buildMessages(this.grabRawMessages(fs.readFileSync(file, 'utf-8')));
  }

}