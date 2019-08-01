import Store from "../Services/Store";
import * as line from "@line/bot-sdk";
import { FEPList, StoreAdvance, Basic, Access, Template, Twibbon } from "./Features";
import { DialogFlow } from "./DialogFlow";
import fs from "fs-extra";
import mkdirp from "mkdirp";
import path from "path";

// import { default_agent } from "../Config/DialogFlow";

import config from "../Config/Line";

// share worker props by groupId
export const shared_props = {};

export class Bot {
  constructor(props) {
    this.getId = this.getId.bind(this);

    shared_props[this.getId(props.event.source).default] = {
      ...shared_props[this.getId(props.event.source).default],
      event: props.event
    };
    // this.shared_props = shared_props
    // console.log(shared_props)
    // only access by? user, group, room, default
    this.props = shared_props[this.getId(props.event.source).default];
    // console.log(this.props)

    // create LINE SDK client
    this.client = new line.Client(config);

    // Features creator
    this.Features = {
      FEPList: FEPList(this),
      StoreAdvance: StoreAdvance(this),
      Basic: Basic(this),
      Access: Access(this),
      Template: Template(this),
      Twibbon: Twibbon(this)
    };

    // DialogFlow assist
    this.DialogFlow = new DialogFlow(this);
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

  setProps(data, id) {
    console.log(data);
    if (!id) id = this.getId().default;

    Object.keys(data).map(key => {
      this.shared_props[id][key] = data[key];
    });
  }

  getId(source) {
    if (!source) source = this.props.event.source;
    const Id = {};

    if (source.groupId) {
      Id["group"] = source.groupId;
      Id["default"] = Id.group;
    } else {
      if (source.roomId) {
        Id["room"] = source.roomId;
        Id["default"] = Id.room;
      } else {
        if (source.userId) {
          Id["user"] = source.userId;
          Id["default"] = Id.user;
        }
      }
    }

    if (Id) return Id;
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
