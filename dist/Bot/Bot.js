"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bot = undefined;

var _Store = require("../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

var _botSdk = require("@line/bot-sdk");

var line = _interopRequireWildcard(_botSdk);

var _internal = require("./internal");

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _DialogFlow = require("./DialogFlow/DialogFlow");

var _DialogFlow2 = _interopRequireDefault(_DialogFlow);

var _Line = require("../Config/Line");

var _Line2 = _interopRequireDefault(_Line);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Bot {
  // create LINE SDK client
  constructor(props) {
    this.props = props;
    this.client = new line.Client(_Line2.default);

    // Features creator
    this.Features = {
      FEPList: (0, _internal.FEPList)(this),
      StoreAdvance: (0, _internal.StoreAdvance)(this),
      Basic: (0, _internal.Basic)(this),
      Access: (0, _internal.Access)(this),
      Template: (0, _internal.Template)(this)
    };

    // DialogFlow assist
    this.DFlow = (0, _DialogFlow2.default)(this);
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