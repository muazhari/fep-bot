import Store from "../Services/Store";
import * as line from "@line/bot-sdk";
import {
  FEPList,
  StoreAdvance,
  Basic,
  Access,
  Template,
  DialogFlow
} from "./internal";
import fs from "fs-extra";
import mkdirp from "mkdirp";
import path from "path";

import config from "../Config/Line";

export class Bot {
  // create LINE SDK client
  constructor(props) {
    this.props = props;
    this.client = new line.Client(config);

    // Features creator
    this.Features = {
      FEPList: FEPList(this),
      StoreAdvance: StoreAdvance(this),
      Basic: Basic(this),
      Access: Access(this),
      Template: Template(this)
    };

    // DialogFlow assist
    this.DialogFlow = DialogFlow(this);
  }

  async log() {
    let log_chat = await Store.getStore("log_chat");
    if (!log_chat || Object.keys(log_chat).length === 0) {
      log_chat = {
        groups: {},
        users: {}
      };
    }

    // switch (this.props.event.source.type) {
    // case 'user':
    //     const { userId } = this.props.event.source
    //     if (!log_chat['users'][userId]) {
    //       log_chat['users'][userId] = []
    //     }
    //     log_chat['user'][userId].push(this.props.event)
    //     return await Store.setStore({ log_chat: log_chat })
    // case 'group':
    //     const { groupId } = this.props.event.source
    //     if (!log_chat['groups'][groupId]) {
    //       log_chat['groups'][groupId] = []
    //     }
    //     log_chat['groups'][groupId].push(this.props.event)
    //     return await Store.setStore({ log_chat: log_chat })
    // }
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
    return this.client.replyMessage(
      this.props.event.replyToken,
      message.map(msg => msg)
    );
  }

  downloadContent(messageId, downloadPath) {
    return this.client.getMessageContent(messageId).then(
      stream =>
        new Promise((resolve, reject) => {
          const writeable = fs.createWriteStream(downloadPath);
          stream.pipe(writeable);
          stream.on("end", () => resolve(downloadPath));
          stream.on("error", reject);
        })
    );
  }
}
