import * as line from "@line/bot-sdk";
import fs from "fs-extra";
import { MainDialogFlow } from "./DialogFlow";
import {
  FEPList,
  StoreAdvance,
  Basic,
  Access,
  Template,
  Twibbon,
  Courses,
  PosetLattice,
} from "./Features";

import lineConfig from "../Config/Line";

import { HandlerBot, SharedProps } from "../Bot";


// share worker props by groupId
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
    // console.log(SharedProps.store)
    // only access by? user, group, room, origin
    this.props = this.initProps(props);
    // console.log(this.props)

    // create LINE SDK client
    this.client = new line.Client(lineConfig);

    //  Features creator
    this.Features = {
      FEPList: FEPList(this),
      StoreAdvance: StoreAdvance(this),
      Basic: Basic(this),
      Access: Access(this),
      Template: Template(this),
      Twibbon: Twibbon(this),
      Courses: Courses(this),
      PosetLattice: PosetLattice(this),
    };

    //  DialogFlow assist
    this.dialogFlow = new MainDialogFlow(this);

    //  Events listen assist
    this.handler = new HandlerBot(this);
    SharedProps.log(this.getId().user);
    console.log("[Bot] Instanced");
  }

  // should updated to implement firebase realtime database
  initProps(props) {
    const sourceIds = this.getId(props.event.source);

    Object.keys(sourceIds).map((type) => {
      SharedProps.store[sourceIds[type]] = {
        ...SharedProps.store[sourceIds[type]],
        event: props.event,
      };
    });

    return SharedProps.store[sourceIds.origin];
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      this.client.getProfile(this.getId().user).then(resolve).catch(reject);
      console.log("[Bot] Got profile");
    });
  }

  getId(source) {
    if (!source) source = this.props.event.source;

    const type = {
      origin: null,
      group: null,
      room: null,
      user: null,
    };

    if (source.groupId) {
      type.origin = source.groupId;
    } else if (source.roomId) {
      type.origin = source.roomId;
    } else if (source.userId) {
      type.origin = source.userId;
    }

    if (source.groupId) {
      type.group = source.groupId;
    }
    if (source.roomId) {
      type.room = source.roomId;
    }
    if (source.userId) {
      type.user = source.userId;
    }

    return type;
  }

  replyText(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.props.event.replyToken,
      texts.map((text) => {
        console.log("[Bot] Send Text, length: ", text.length);
        return { type: "text", text };
      })
    );
  }

  sendMessage(message) {
    message = Array.isArray(message) ? message : [message];
    return this.client.replyMessage(
      this.props.event.replyToken,
      message.map((msg) => {
        console.log("[Bot] Send Message");
        return msg;
      })
    );
  }

  downloadContent(messageId, downloadPath) {
    return this.client.getMessageContent(messageId).then(
      (stream) =>
        new Promise((resolve, reject) => {
          const writeable = fs.createWriteStream(downloadPath);
          stream.pipe(writeable);
          stream.on("end", () => {
            console.log("[Bot] Content Successfuly Downloaded", downloadPath);
            resolve(downloadPath);
          });
          stream.on("error", (err) => {
            reject(err);
          });
        })
    );
  }
}
