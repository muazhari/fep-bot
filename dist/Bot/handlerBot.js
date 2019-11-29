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

var _internal = require("./internal");

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

const commandValidate = chat => {
  const prefix = chat[0][0];
  const command = chat[0].slice(1, chat[0].length);
  const args = chat.slice(1, chat.length).map(item => item.trim());

  if (prefix === command_prefix) {
    console.log({ prefix, command, args });
    return { prefix, command, args };
  } else {
    return false;
  }
};

const handleCommand = (commandList, commandValidate) => {
  const {
    prefix: content_prefix,
    command: content_command,
    args: content_args
  } = commandValidate;

  if (Object.keys(commandList).includes(content_command)) {
    if (commandList[content_command].length >= 1) {
      commandList[content_command](content_args);
    } else {
      commandList[content_command]();
    }
  }
};

const userQueue = Bot => {
  const queue = {};

  const increment = () => {
    const { user: userId } = Bot.getId();
    if (!queue[userId]) {
      queue[userId] = 0;
    }
    queue[userId] += 1;
  };

  const decrement = () => {
    const { user: userId } = Bot.getId();
    if (!queue[userId]) {
      queue[userId] = 0;
    }
    if (queue[userId] >= 1) {
      queue[userId] -= 1;
    }
  };

  return { increment, decrement };
};

const handlerBot = exports.handlerBot = event => {
  console.log(event);

  const Worker = new _internal.Bot({ event });
  // Worker.log()

  // const whitelist = Worker.Features.Access.whitelist();
  // console.log(whitelist);
  // const type = whitelist.user || whitelist.room ? event.type : null;

  switch (event.type) {
    case "message":
      const { message } = event;
      switch (message.type) {
        case "text":
          return handleText(Worker);
        case "image":
          return handleImage(Worker);
        case "video":
          return handleVideo(Worker);
        case "audio":
          return handleAudio(Worker);
        case "location":
          return handleLocation(Worker);
        case "sticker":
          return handleSticker(Worker);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case "memberJoined":
      return Worker.client.getProfile(event.joined.members[0].userId).then(profile => {
        Worker.replyText(`Welcome ${profile.displayName}! Jangan lupa cek notes di group ya!`);
      });

    case "follow":
      return Worker.replyText("Got followed event");

    case "unfollow":
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case "join":
      return Worker.replyText(`Joined ${event.source.type}`);

    case "leave":
      return console.log(`Left: ${JSON.stringify(event)}`);

    case "postback":
      let { data } = event.postback;
      if (data === "DATE" || data === "TIME" || data === "DATETIME") {
        data += `(${JSON.stringify(event.postback.params)})`;
      }

      const objectData = JSON.parse(data);

      const { Twibbon } = Worker.Features;
      Twibbon.listen(objectData);

      break;

    case "beacon":
      return Worker.replyText(`Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
};

const handleText = Bot => {
  const { message, replyToken, source } = Bot.props.event;
  const {
    FEPList,
    StoreAdvance,
    Basic,
    Template,
    Twibbon,
    Courses,
    PosetLattice
  } = Bot.Features;

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
    pl: PosetLattice.generate
  };

  // The text query request.
  const chat_splitted = message.text.split(" ");
  const msgToCmdValidate = commandValidate(chat_splitted);
  if (msgToCmdValidate) {
    handleCommand(commandList, msgToCmdValidate);
  } else {
    // hidden error, need fix
    (0, _internal.handlerDialogFlow)(Bot);
  }
};

const handleImage = Bot => {
  const { message, replyToken } = Bot.props.event;
  let getContent;

  if (message.contentProvider.type === "line") {
    const downloadPath = _path2.default.join(__dirname, "../../src/Bot/Assets/downloaded/images", `${message.id}.jpg`);
    const previewPath = _path2.default.join(__dirname, "../../src/Bot/Assets/downloaded/images", `${message.id}-preview.jpg`);

    getContent = () => {
      return Bot.downloadContent(message.id, downloadPath).then(downloadPath => {
        console.log("premature_resolve", downloadPath);
        _child_process2.default.execSync(`convert -resize 240x jpg:${downloadPath} jpg:${previewPath}`);
        return {
          originalPath: downloadPath,
          previewPath: previewPath,
          originalContentUrl: `${baseURL}/downloaded/images/${_path2.default.basename(downloadPath)}`,
          previewImageUrl: `${baseURL}/downloaded/images/${_path2.default.basename(previewPath)}`
        };
      }).catch(err => {
        throw err;
      });
    };
  } else if (message.contentProvider.type === "external") {
    getContent = () => {
      return Promise.resolve(message.contentProvider);
    };
  }

  // Twibbon switch
  const { Twibbon } = Bot.Features;
  Twibbon.insert(getContent);
};

const handleVideo = Bot => {
  const { message, replyToken } = Bot.props.event;
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = _path2.default.join(__dirname, "../../src/Bot/Assets/downloaded/videos", `${message.id}.mp4`);
    const previewPath = _path2.default.join(__dirname, "../../src/Bot/Assets/downloaded/videos", `${message.id}-preview.jpg`);

    getContent = Bot.downloadContent(message.id, downloadPath).then(downloadPath => {
      // FFmpeg and ImageMagick is needed here to run 'convert'
      // Please consider about security and performance by yourself
      _child_process2.default.execSync(`convert mp4:${downloadPath}[0] jpeg:${previewPath}`);

      return {
        originalContentUrl: `${baseURL}/downloaded/videos/${_path2.default.basename(downloadPath)}`,
        previewImageUrl: `${baseURL}/downloaded/videos/${_path2.default.basename(previewPath)}`
      };
    });
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({ originalContentUrl, previewImageUrl }) => {
    // Bot.sendMessage({
    //   type: "video",
    //   originalContentUrl,
    //   previewImageUrl
    // });
  });
};

const handleAudio = Bot => {
  const { message, replyToken } = Bot.props.event;
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = _path2.default.join(__dirname, "../../src/Bot/Assets/downloaded/audios", `${message.id}.m4a`);

    getContent = Bot.downloadContent(message.id, downloadPath).then(downloadPath => {
      return {
        originalContentUrl: `${baseURL}/downloaded/audios/${_path2.default.basename(downloadPath)}`
      };
    });
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({ originalContentUrl }) => {
    // Bot.sendMessage({
    //   type: "audio",
    //   originalContentUrl,
    //   duration: message.duration
    // });
  });
};

const handleLocation = Bot => {
  const { message, replyToken } = Bot.props.event;
  Bot.sendMessage({
    type: "location",
    title: message.title,
    address: message.address,
    latitude: message.latitude,
    longitude: message.longitude
  });
};

const handleSticker = Bot => {
  const { message, replyToken } = Bot.props.event;
  // Bot.sendMessage({
  //   type: "sticker",
  //   packageId: message.packageId,
  //   stickerId: message.stickerId
  // });
};
//# sourceMappingURL=handlerBot.js.map