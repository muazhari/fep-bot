"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bot = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _botSdk = require("@line/bot-sdk");

var line = _interopRequireWildcard(_botSdk);

var _Features = require("./Features");

var _DialogFlow = require("./DialogFlow");

var _Store = require("../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

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

var _Bot = require("../Bot");

var _Firebase = require("../Services/Firebase");

var _Firebase2 = _interopRequireDefault(_Firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

class Bot {
  constructor(props) {
    // console.log(SharedProps.store)
    // only access by? user, group, room, origin
    this.props = this.initProps(props);
    // console.log(this.props)

    // create LINE SDK client
    this.client = new line.Client(_Line2.default);

    //  Features creator
    this.Features = {
      FEPList: (0, _Features.FEPList)(this),
      StoreAdvance: (0, _Features.StoreAdvance)(this),
      Basic: (0, _Features.Basic)(this),
      Access: (0, _Features.Access)(this),
      Template: (0, _Features.Template)(this),
      Twibbon: (0, _Features.Twibbon)(this),
      Courses: (0, _Features.Courses)(this),
      PosetLattice: (0, _Features.PosetLattice)(this)
    };

    //  DialogFlow assist
    this.dialogFlow = new _DialogFlow.dialogFlow(this);

    //  Events listen assist
    this.handler = new _Bot.handlerBot(this);
    _Bot.SharedProps.log(this.getId().user);
    console.log("[Bot] Instanced");
  }

  //should updated to implement firebase realtime database
  initProps(props) {
    const sourceIds = this.getId(props.event.source);

    Object.keys(sourceIds).map(type => {
      _Bot.SharedProps.store[sourceIds[type]] = _extends({}, _Bot.SharedProps.store[sourceIds[type]], {
        event: props.event
      });
    });

    return _Bot.SharedProps.store[sourceIds.origin];
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      this.client.getProfile(this.getId().user).then(resolve).catch(reject);
      console.log("[Bot] Got profile");
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
    return this.client.replyMessage(this.props.event.replyToken, texts.map(text => {
      console.log("[Bot] Sent Text, length: ", text.length);
      return { type: "text", text };
    }));
  }

  sendMessage(message) {
    message = Array.isArray(message) ? message : [message];
    return this.client.replyMessage(this.props.event.replyToken, message.map(msg => {
      console.log("[Bot] Sent Message");
      return msg;
    }));
  }

  downloadContent(messageId, downloadPath) {
    return this.client.getMessageContent(messageId).then(stream => new Promise((resolve, reject) => {
      const writeable = _fsExtra2.default.createWriteStream(downloadPath);
      stream.pipe(writeable);
      stream.on("end", () => {
        console.log("[Bot] Content Download Success", downloadPath);
        resolve(downloadPath);
      });
      stream.on("error", err => {
        console.log("[Bot] Content Download Failed ", err);
        reject(err);
      });
    }));
  }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map