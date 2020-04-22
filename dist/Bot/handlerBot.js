"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlerBot = exports.command_prefix = exports.batch_list = exports.baseURL = undefined;

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _Bot = require("../Bot");

var _CloudinaryUtils = require("../Bot/Helper/CloudinaryUtils");

var _CloudinaryUtils2 = _interopRequireDefault(_CloudinaryUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// base URL for webhook server
const baseURL = exports.baseURL = process.env.BASE_URL;

const batch_list = exports.batch_list = {
  a: "22 - 27 JULI 2019",
  b: "29 JULI - 3 AGUSTUS 2019",
  c: "5 - 10 AGUSTUS 2019",
  d: "19 - 24 AGUSTUS 2019",
  e: "26 - 03 SEPTEMBER 2019"
};

const command_prefix = exports.command_prefix = "/";

const destructCommand = chat => {
  const prefix = chat[0][0];
  const command = chat[0].slice(1, chat[0].length);
  const args = chat.slice(1, chat.length).map(item => item.trim());

  console.log("[HandlerBot] Command destructed", { prefix, command, args });
  return { prefix, command, args };
};

const handleCommand = (features, command) => {
  const {
    FEPList,
    StoreAdvance,
    Basic,
    Template,
    Twibbon,
    Courses,
    PosetLattice
  } = features;

  const commandList = {
    add: FEPList.add,
    upd: FEPList.update,
    rem: FEPList.remove,
    view: FEPList.view,
    rstore: StoreAdvance.reset_store,
    pstore: StoreAdvance.pre_store,
    bstore: StoreAdvance.backup_store,
    "]]": Basic.admin,
    help: Basic.help,
    button: Template.button,
    profile: Basic.profile,
    confirm: Template.confirm,
    bifest: Template.bifest,
    greet: Basic.greet,
    say: Basic.say,
    twibbon: Twibbon.ready,
    algo: Courses.algo,
    pl: PosetLattice.generate,
    binushack: Template.binushack,
    test: Template.test
  };

  const {
    prefix: content_prefix,
    command: content_command,
    args: content_args
  } = destructCommand(command);

  if (Object.keys(commandList).includes(content_command)) {
    if (commandList[content_command].length >= 1) {
      commandList[content_command](content_args);
    } else {
      commandList[content_command]();
    }
  }
};

const userQueue = userId => {
  const queue = {};

  const increment = () => {
    if (!queue[userId]) {
      queue[userId] = 0;
    }
    queue[userId] += 1;
  };

  const decrement = () => {
    if (!queue[userId]) {
      queue[userId] = 0;
    }
    if (queue[userId] >= 1) {
      queue[userId] -= 1;
    }
  };

  return { increment, decrement };
};

class handlerBot {
  constructor(Bot) {
    this.Bot = Bot;
    this.features = Bot.Features;
    this.eventListener(Bot.props.event);
  }

  eventListener(event) {
    console.log("[HandlerBot] Event:", event);
    // hidden error, need fix
    // const this.Bot = new Bot({ event });
    // this.Bot.log()

    // const whitelist = this.Bot.Features.Access.whitelist();
    // console.log(whitelist);
    // const type = whitelist.user || whitelist.room ? event.type : null;

    switch (event.type) {
      case "message":
        const { message } = event;
        switch (message.type) {
          case "text":
            return this.handleText();
          case "image":
            return this.handleImage();
          case "video":
            return this.handleVideo();
          case "audio":
            return this.handleAudio();
          case "location":
            return this.handleLocation();
          case "sticker":
            return this.handleSticker();
          default:
            throw new Error(`Unknown message: ${JSON.stringify(message)}`);
        }

      case "memberJoined":
        return this.Bot.client.getProfile(event.joined.members[0].userId).then(profile => {
          this.Bot.replyText(`Welcome ${profile.displayName}! Jangan lupa cek notes di group ya!`);
        });

      case "follow":
        return this.Bot.replyText("Got followed event");

      case "unfollow":
        return console.log(`[HandlerBot] Unfollowed this bot: ${JSON.stringify(event)}`);

      case "join":
        return this.Bot.replyText(`Joined ${event.source.type}`);

      case "leave":
        return console.log(`[HandlerBot] Left: ${JSON.stringify(event)}`);

      case "postback":
        let { data } = event.postback;
        if (data === "DATE" || data === "TIME" || data === "DATETIME") {
          data += `(${JSON.stringify(event.postback.params)})`;
        }

        const objectData = JSON.parse(data);

        const { Twibbon } = this.Bot.Features;
        console.log("[HandlerBot] Postback listened", objectData);
        Twibbon.listenPostback(objectData);

        break;

      case "beacon":
        return this.Bot.replyText(`Got beacon: ${event.beacon}`);

      default:
        throw new Error(`[HandlerBot] Unknown event: ${JSON.stringify(event)}`);
    }
  }

  handleText() {
    const { message, replyToken, source } = this.Bot.props.event;

    // The text query request.
    const splittedChat = message.text.split(" ");
    const isTextCommand = splittedChat[0][0] === command_prefix;
    if (isTextCommand) {
      handleCommand(this.Bot.Features, splittedChat);
    } else {
      // hidden error, need fix
      this.Bot.dialogFlow.listen();
    }
  }

  handleImage() {
    const { message, replyToken } = this.Bot.props.event;
    let getContent;

    const imageData = {
      originalContentPath: _path2.default.join(__dirname, "../../assets/downloaded/images", `${message.id}.jpg`),
      previewPath: _path2.default.join(__dirname, "../../assets/downloaded/images", `${message.id}-preview.jpg`),
      originalContentUrl: `${baseURL}/downloaded/images/${message.id}.jpg`,
      previewImageUrl: `${baseURL}/downloaded/images/${message.id}.jpg`
    };

    // const imageLogData = {
    //   originalContentPath: path.join(
    //     __dirname,
    //     "../../assets/downloaded/images",
    //     `${message.id}-log.jpg`
    //   ),
    //   originalContentUrl: `${baseURL}/downloaded/images/${message.id}-log.jpg`
    // };

    // this.Bot.downloadContent(message.id, imageLogData.originalContentPath).then(
    //   () => {
    //     CloudinaryUtils.upload(
    //       imageLogData.originalContentUrl,
    //       `logs:images:${message.id}`
    //     )
    //       .then(() => {
    //         fs.unlinkSync(imageLogData.originalContentPath);
    //         console.log(
    //           "[HandlerBot] Image log success",
    //           imageLogData.originalContentPath
    //         );
    //       })
    //       .catch(err => {
    //         console.log(
    //           "[HandlerBot] Image log failed",
    //           imageLogData.originalContentPath
    //         );
    //       });
    //   }
    // );

    if (message.contentProvider.type === "line") {
      getContent = () => {
        return this.Bot.downloadContent(message.id, imageData.originalContentPath).then(() => {
          _child_process2.default.execSync(`convert -resize 240x jpg:${imageData.originalContentPath} jpg:${imageData.previewPath}`);
          return imageData;
        }).catch(err => {
          throw err;
        });
      };

      // Twibbon switch
      let listenStatus = true;
      const { Twibbon } = this.Bot.Features;
      listenStatus = Twibbon.listenImage(getContent);

      if (!listenStatus) {
        _fsExtra2.default.unlinkSync(imageData.originalContentPath);
        _fsExtra2.default.unlinkSync(imageData.previewPath);
        console.log("[HandlerBot] Image listen status verdict is unused", imageLogData.originalContentPath);
      } else {
        console.log("[HandlerBot] Image listen status verdict is used", imageLogData.originalContentPath);
      }
    } else if (message.contentProvider.type === "external") {
      getContent = () => {
        return Promise.resolve(message.contentProvider);
      };
    }

    return getContent.then(({ originalContentUrl, previewImageUrl }) => {
      // this.Bot.sendMessage({
      //   type: "image",
      //   originalContentUrl: originalContentUrl,
      //   previewImageUrl: previewImageUrl
      // });
    });
  }

  handleVideo() {
    const { message, replyToken } = this.Bot.props.event;
    let getContent;

    const videoData = {
      originalContentPath: _path2.default.join(__dirname, "../../assets/downloaded/videos", `${message.id}.mp4`),
      previewPath: _path2.default.join(__dirname, "../../assets/downloaded/videos", `${message.id}-preview.mp4`),
      originalContentUrl: `${baseURL}/downloaded/videos/${message.id}.mp4`,
      previewImageUrl: `${baseURL}/downloaded/videos/${message.id}.mp4`
    };

    const videoLogData = {
      originalContentPath: _path2.default.join(__dirname, "../../assets/downloaded/videos", `${message.id}-log.mp4`),
      originalContentUrl: `${baseURL}/downloaded/videos/${message.id}-log.mp4`
    };

    this.Bot.downloadContent(message.id, videoLogData.originalContentPath).then(() => {
      _CloudinaryUtils2.default.upload(videoLogData.originalContentUrl, `logs/videos/${message.id}`).then(() => {
        _fsExtra2.default.unlinkSync(videoLogData.originalContentPath);
        console.log("[HandlerBot] Video log success", videoLogData.originalContentPath);
      }).catch(err => {
        console.log("[HandlerBot] Video log failed", videoLogData.originalContentPath);
      });
    });

    if (message.contentProvider.type === "line") {
      // getContent = this.Bot.downloadContent(
      //   message.id,
      //   videoData.originalContentPath
      // ).then(() => {
      //   // FFmpeg and ImageMagick is needed here to run 'convert'
      //   // Please consider about security and performance by yourself
      //   cp.execSync(
      //     `convert mp4:${videoData.originalContentPath} jpeg:${videoData.previewPath}`
      //   );

      //   return videoData;
      // });
    } else if (message.contentProvider.type === "external") {
      getContent = () => {
        return Promise.resolve(message.contentProvider);
      };
    }

    return getContent.then(({ originalContentUrl, previewImageUrl }) => {
      // this.Bot.sendMessage({
      //   type: "video",
      //   originalContentUrl,
      //   previewImageUrl
      // });
    });
  }

  handleAudio() {
    const { message, replyToken } = this.Bot.props.event;
    let getContent;

    const audioData = {
      originalContentPath: _path2.default.join(__dirname, "../../assets/downloaded/audios", `${message.id}.m4a`),
      originalContentUrl: `${baseURL}/downloaded/audios/${message.id}.m4a`
    };

    const audioLogData = {
      originalContentPath: _path2.default.join(__dirname, "../../assets/downloaded/audios", `${message.id}-log.m4a`),
      originalContentUrl: `${baseURL}/downloaded/audios/${message.id}-log.m4a`
    };

    this.Bot.downloadContent(message.id, audioLogData.originalContentPath).then(() => {
      _CloudinaryUtils2.default.upload(audioLogData.originalContentUrl, `logs/audios/${message.id}`).then(() => {
        _fsExtra2.default.unlinkSync(audioLogData.originalContentPath);
        console.log("[HandlerBot] Audio log success", audioLogData.originalContentPath);
      }).catch(err => {
        console.log("[HandlerBot] Audio log failed", audioLogData.originalContentPath);
      });
    });
    // 

    if (message.contentProvider.type === "line") {
      // getContent = this.Bot.downloadContent(
      //   message.id,
      //   audioData.originalContentPath
      // ).then(() => {
      //   return audioData;
      // });
    } else {
      getContent = () => {
        return Promise.resolve(message.contentProvider);
      };
    }

    return getContent.then(({ originalContentUrl }) => {
      // this.Bot.sendMessage({
      //   type: "audio",
      //   originalContentUrl,
      //   duration: message.duration
      // });
    });
  }

  handleLocation() {
    const { message, replyToken } = this.Bot.props.event;
    this.Bot.sendMessage({
      type: "location",
      title: message.title,
      address: message.address,
      latitude: message.latitude,
      longitude: message.longitude
    });
  }

  handleSticker() {
    const { message, replyToken } = this.Bot.props.event;
    // this.Bot.sendMessage({
    //   type: "sticker",
    //   packageId: message.packageId,
    //   stickerId: message.stickerId
    // });
  }
}
exports.handlerBot = handlerBot;
//# sourceMappingURL=handlerBot.js.map