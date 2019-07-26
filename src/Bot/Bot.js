import { getStore, setStore } from "../Services/Store";
import * as line from "@line/bot-sdk";
import { FEPList, StoreAdvance, Basic, Access, Template } from "./internal";
import fs from "fs";

import config from "../Config/Line";

export class Bot {
  // create LINE SDK client
  constructor(props) {
    this.props = props;
    this.client = new line.Client(config);

    // Command creator
    this.Command = {
      FEPList: FEPList(this),
      StoreAdvance: StoreAdvance(this),
      Basic: Basic(this),
      Access: Access(this),
      Template: Template(this),
    };
  }

  replyText(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.props.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
  
  sendMessage(message) {
    message = Array.isArray(message) ? message : [message];
    return this.client.replyMessage(this.props.event.replyToken, message.map(msg => (msg)))
  }

  downloadContent(messageId, downloadPath) {
    return this.client.getMessageContent(messageId).then(
      stream =>
        new Promise((resolve, reject) => {
          const writable = fs.createWriteStream(downloadPath);
          stream.pipe(writable);
          stream.on("end", () => resolve(downloadPath));
          stream.on("error", reject);
        })
    );
  }
}
