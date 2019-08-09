"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bot = exports.shared_props = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// import { default_agent } from "../Config/DialogFlow";

var _Store = require("../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

var _botSdk = require("@line/bot-sdk");

var line = _interopRequireWildcard(_botSdk);

var _Features = require("./Features");

var _DialogFlow = require("./DialogFlow");

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _uuid = require("uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _Line = require("../Config/Line");

var _Line2 = _interopRequireDefault(_Line);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// share worker props by groupId
const shared_props = exports.shared_props = {};
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

class Bot {
  constructor(props) {
    this.getId = this.getId.bind(this);
    this.initProps = this.initProps.bind(this);

    // this.shared_props = shared_props
    // console.log(shared_props)
    // only access by? user, group, room, default
    this.props = this.initProps(props);
    // console.log(this.props)

    // create LINE SDK client
    this.client = new line.Client(_Line2.default);

    // Features creator
    this.Features = {
      FEPList: (0, _Features.FEPList)(this),
      StoreAdvance: (0, _Features.StoreAdvance)(this),
      Basic: (0, _Features.Basic)(this),
      Access: (0, _Features.Access)(this),
      Template: (0, _Features.Template)(this),
      Twibbon: (0, _Features.Twibbon)(this)
    };

    // DialogFlow assist
    this.DialogFlow = new _DialogFlow.DialogFlow(this);

    // Events listen assist
    // this.listener = new listener(this)
  }

  initProps(props) {
    const SourceIds = this.getId(props.event.source);

    Object.keys(SourceIds).map(type => {
      shared_props[SourceIds[type]] = _extends({}, shared_props[SourceIds[type]], {
        event: props.event
      });
    });

    return shared_props[SourceIds.default];
  }

  profile() {
    return new Promise((resolve, reject) => {
      this.client.getProfile(this.getId().user).then(resolve).catch(reject);
    });
  }

  async log() {
    let log_chat = await _Store2.default.getStore("log_chat");
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
    const type = {};

    if (source.groupId) {
      type["default"] = source.groupId;
    } else {
      if (source.roomId) {
        type["default"] = source.roomId;
      } else {
        if (source.userId) {
          type["default"] = source.userId;
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
    return this.client.replyMessage(this.props.event.replyToken, texts.map(text => ({ type: "text", text })));
  }

  sendMessage(message) {
    message = Array.isArray(message) ? message : [message];
    return this.client.replyMessage(this.props.event.replyToken, message.map(msg => msg));
  }

  downloadContent(messageId, downloadPath) {
    return this.client.getMessageContent(messageId).then(stream => new Promise((resolve, reject) => {
      const writeable = _fsExtra2.default.createWriteStream(downloadPath);
      stream.pipe(writeable);
      stream.on("end", () => resolve(downloadPath));
      stream.on("error", reject);
    }));
  }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map