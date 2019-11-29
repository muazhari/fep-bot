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
import { DialogFlow } from "./DialogFlow";
import fs from "fs-extra";
import mkdirp from "mkdirp";
import path from "path";
import uuid from "uuid";

import config from "../Config/Line";

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
    this.getId = this.getId.bind(this);
    this.initProps = this.initProps.bind(this);

    // this.shared_props = shared_props
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
    this.DialogFlow = new DialogFlow(this);

    // Events listen assist
    // this.listener = new listener(this)
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

  profile() {
    return new Promise((resolve, reject) => {
      this.client
        .getProfile(this.getId().user)
        .then(resolve)
        .catch(reject);
    });
  }

  log() {
    Store.getStore("log_chat").then(log_chat => {
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
    });
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
