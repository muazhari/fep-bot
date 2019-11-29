import Store from "../Services/Store";
import * as line from "@line/bot-sdk";
import {
  FEPList,
  StoreAdvance,
  Basic,
  Access,
  Template,
  Twibbon,
  Courses,
  PosetLattice
} from "./Features";
import { dialogFlow } from "./DialogFlow";
import fs from "fs-extra";
import mkdirp from "mkdirp";
import path from "path";
import uuid from "uuid";

import config from "../Config/Line";

import { handlerBot } from "./internal";

// share worker props by groupId
export const shared_props = {};
// export const listener_stack = {
//   postback: {}
// };

// class listener {
//   constructor(Bot){
//     this.Bot = Bot
//     this.event = this.Bot.props.event
//   }

//   push(callback){
//     listener_stack[this.Bot.getId().user] = callback
//   }

//   postback(stringObject, callback) {
//     const data = JSON.parse(stringObject)
//     return callback(listener_stack.postback[uuid.v4])
//   }
// }

export class Bot {
  constructor(props) {
    // console.log(shared_props)
    // only access by? user, group, room, origin
    this.props = this.initProps(props);
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
      Twibbon: Twibbon(this),
      Courses: Courses(this),
      PosetLattice: PosetLattice(this)
    };

    // DialogFlow assist
    this.dialogFlow = new dialogFlow(this);

    // Events listen assist
    this.handler = new handlerBot(this);
    this.log();
    console.log("Bot instanced");
  }

  initProps(props) {
    const sourceIds = this.getId(props.event.source);

    Object.keys(sourceIds).map(type => {
      shared_props[sourceIds[type]] = {
        ...shared_props[sourceIds[type]],
        event: props.event
      };
    });

    return shared_props[sourceIds.origin];
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      this.client
        .getProfile(this.getId().user)
        .then(resolve)
        .catch(reject);
    });
  }

  log() {
    new Promise(async (resolve, reject) => {
      const val = { [this.props.event.timestamp]: this.props };
      const old = await Store.getStore("propsLogs");
      console.log("old", old);
      await Store.setStore({"propsLogs" : {...old, ...val}});
      console.log("[LOG] Props logged", this.props.event.timestamp);
    });

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
    if (!id) id = this.getId().origin;

    Object.keys(data).map(key => {
      this.shared_props[id][key] = data[key];
    });
  }

  getId(source) {
    if (!source) source = this.props.event.source;
    const type = {};

    if (source.groupId) {
      type["origin"] = source.groupId;
    } else {
      if (source.roomId) {
        type["origin"] = source.roomId;
      } else {
        if (source.userId) {
          type["origin"] = source.userId;
        }
      }
    }

    if (source.groupId) {
      type["group"] = source.groupId;
    }
    if (source.roomId) {
      type["room"] = source.roomId;
    }
    if (source.userId) {
      type["user"] = source.userId;
    }

    if (type) return type;
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
