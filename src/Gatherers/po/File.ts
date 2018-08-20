import { POMessage } from './index';

export class POFile {

  constructor(readonly messages: POMessage[]){}

  merge(newfile: POFile): POFile {

    let mergedMessages:POMessage[] = this.messages;
  
    newfile.messages.forEach(msg => {
  
      if (!mergedMessages.some(m => m.msgctxt == msg.msgctxt && (m.msgid == msg.msgid || (m.msgid_plural == msg.msgid_plural && msg.msgid_plural.length > 0))))
        mergedMessages.push(msg);
    });
      
    return new POFile(mergedMessages);
  };

  get content(): string {

    return this.messages.map(msg => msg.pot).join('\n');
  }
};