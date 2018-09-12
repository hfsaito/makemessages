import * as glob from 'glob';
import * as fs from 'fs';

import { findAll } from '../helpers/index';

import { PoMessage, PoFile } from './index';

let messageRE = /(?:#.*\n)*(?:msgctxt (?:".*"\n)+)?msgid (?:".*"\n)+(?:msgid_plural (?:".*"\n)+)?(?:msgstr(?:\[\d+\])? (?:".*"\n?)+)+/g;
let commentsRE = /#.*/g;
let msgctxtRE = /msgctxt ((?:"(?:.*?(?:\\")?.*?)*?"\n?)+)/g;
let msgidRE = /msgid ((?:"(?:.*?(?:\\")?.*?)*?"\n?)+)/g;
let msgid_pluralRE = /msgid_plural ((?:"(?:.*?(?:\\")?.*?)*?"\n?)+)/g;
let msgstrRE = /msgstr(?:\[\d+\])? ((?:"(?:.*?(?:\\")?.*?)*?"\n?)+)/g;

function grabRawMessages(fileContent: string): string[] {

  messageRE.lastIndex = 0;
  return findAll(fileContent, messageRE).map(m => m[0]);
}

function grabComments(rawMessage: string): string[] {

  commentsRE.lastIndex = 0;
  return findAll(rawMessage, commentsRE).map(m => m[0].replace(/^#\s?/g, ''));
}

function grabMsgctxt(rawMessage: string): string {

  msgctxtRE.lastIndex = 0;
  let msgctxt_match = msgctxtRE.exec(rawMessage);
  if (msgctxt_match)
    return msgctxt_match[1].split('\n').map(msg => msg.slice(1, -1)).join('');
  return '';
}

function grabMsgid(rawMessage: string): string {

  msgidRE.lastIndex = 0;
  return msgidRE.exec(rawMessage)[1].split('\n').map(msg => msg.slice(1, -1)).join('');
}

function grabMsgid_plural(rawMessage: string): string {

  msgid_pluralRE.lastIndex = 0;
  let msgid_plural_match = msgid_pluralRE.exec(rawMessage);
  if (msgid_plural_match)
    return msgid_plural_match[1].split('\n').map(msg => msg.slice(1, -1)).join('');
  return '';
}


function grabMsgstr(rawMessage: string): string[] {

  return findAll(rawMessage, msgstrRE).map(m => m[1].split('\n').filter(msg => msg.length > 0).map(msg => msg.slice(1, -1)).join(''));
}

function buildMessages(rawMessages: string[]): PoMessage[] {

  return rawMessages.map(raw => {

    let comments: string[] = grabComments(raw);
    let msgctxt: string = grabMsgctxt(raw);
    let msgid: string = grabMsgid(raw);
    let msgid_plural: string = grabMsgid_plural(raw);
    let msgstr = grabMsgstr(raw);

    return new PoMessage(msgid, msgstr, comments, msgctxt, msgid_plural);
  });
}

export function poRead(file: string): PoFile {

  if (fs.existsSync(file))
    return new PoFile(buildMessages(grabRawMessages(fs.readFileSync(file, 'utf-8'))), file);
  return new PoFile([]);
}

export function poReadMultiple(files: string): PoFile[] {

  return glob.sync(files).map(poRead);
}