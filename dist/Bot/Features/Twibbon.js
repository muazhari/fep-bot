"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Twibbon = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Bot = require("../../Bot");

var _FEPStoreCRUD = require("../../Bot/Helper/FEPStoreCRUD");

var _FEPStoreCRUD2 = _interopRequireDefault(_FEPStoreCRUD);

var _cloudinary = require("cloudinary");

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
}

const Twibbon = exports.Twibbon = Bot => {
  const uploads = {};

  const manual_transform = (twibbon_overlay, filename, size) => {
    return {
      transformation: [{
        crop: "fit",
        width: size,
        height: size,
        format: "jpg",
        public_id: `${filename}-twibbon`
      }, {
        overlay: twibbon_overlay,
        flags: "relative",
        width: size,
        height: size,
        aspect_ratio: "1:1"
      }]
    };
  };

  const twibbon_list = {
    twibbon_cs: {
      category: "socs",
      name: "Computer Science",
      url: "https://res.cloudinary.com/fep-bot/image/upload/v1564639746/twibbon_cs.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [{
              gravity: "auto",
              crop: "fill",
              format: "jpg",
              aspect_ratio: "1:1",
              public_id: `${filename}-twibbon`
            }, {
              gravity: "auto",
              crop: "fill_pad",
              width: size,
              height: size,
              y: Math.floor(-size * 0.2),
              x: Math.floor(size * 0.045)
            }, {
              overlay: "twibbon_cs.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          },
          manual: {
            transformation: [{
              crop: "fit",
              format: "jpg",
              width: size,
              height: size,
              public_id: `${filename}-twibbon`
            }, {
              overlay: "twibbon_cs.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          }
        };
      }
    },

    twibbon_tfi: {
      category: "tfi",
      name: "Teach For Indonesia",
      url: "https://res.cloudinary.com/fep-bot/image/upload/v1565361689/twibbon_tfi.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [{
              gravity: "auto",
              crop: "fill",
              format: "jpg",
              // aspect_ratio: "1:1",
              width: size + Math.floor(-size * 0.045),
              height: size + Math.floor(size * 0.2),
              x: Math.floor(size * 0.045),
              y: Math.floor(-size * 0.2),
              public_id: `${filename}-twibbon`
            }, {
              gravity: "auto",
              crop: "fill",
              width: size,
              height: size
            }, {
              overlay: "twibbon_tfi.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          },
          manual: {
            transformation: [{
              crop: "fit",
              format: "jpg",
              // aspect_ratio: "1:1",
              width: size,
              height: size,
              public_id: `${filename}-twibbon`
            }, {
              overlay: "twibbon_tfi.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          }
        };
      }
    },

    twibbon_binus1: {
      category: "binus",
      name: "Binus 1",
      url: "https://res.cloudinary.com/fep-bot/image/upload/v1565372081/twibbon_binus1.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [{
              gravity: "auto",
              crop: "fill",
              format: "jpg",
              // aspect_ratio: "1:1",
              width: size - Math.floor(size * 0.2),
              height: size - Math.floor(size * 0.2),
              public_id: `${filename}-twibbon`
            }, {
              overlay: "twibbon_binus1.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          },
          manual: {
            transformation: [{
              crop: "fit",
              format: "jpg",
              // aspect_ratio: "1:1",
              width: size - Math.floor(size * 0.2125),
              height: size - Math.floor(size * 0.2),
              public_id: `${filename}-twibbon`
            }, {
              overlay: "twibbon_binus1.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          }
        };
      }
    },

    twibbon_binus2: {
      category: "binus",
      name: "Binus 2",
      url: "https://res.cloudinary.com/fep-bot/image/upload/v1565372079/twibbon_binus2.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [{
              gravity: "auto",
              crop: "fill",
              format: "jpg",
              // aspect_ratio: "1:1",
              width: size - Math.floor(size * 0.225),
              height: size - Math.floor(size * 0.225),
              public_id: `${filename}-twibbon`
            }, {
              overlay: "twibbon_binus2.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          },
          manual: {
            transformation: [{
              crop: "fit",
              format: "jpg",
              // aspect_ratio: "1:1",
              width: size - Math.floor(size * 0.225),
              height: size - Math.floor(size * 0.225),
              public_id: `${filename}-twibbon`
            }, {
              overlay: "twibbon_binus2.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          }
        };
      }
    },

    twibbon_binus3: {
      category: "binus",
      name: "Binus 3",
      url: "https://res.cloudinary.com/fep-bot/image/upload/v1565372078/twibbon_binus3.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [{
              gravity: "auto",
              crop: "fill",
              format: "jpg",
              // aspect_ratio: "1:1",
              width: size - Math.floor(size * 0.225),
              height: size - Math.floor(size * 0.225),
              public_id: `${filename}-twibbon`
            }, {
              overlay: "twibbon_binus3.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          },
          manual: {
            transformation: [{
              crop: "fit",
              format: "jpg",
              // aspect_ratio: "1:1",
              width: size - Math.floor(size * 0.225),
              height: size - Math.floor(size * 0.225),
              public_id: `${filename}-twibbon`
            }, {
              overlay: "twibbon_binus3.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }]
          }
        };
      }
    }
  };

  const ready = args => {
    if (args.length <= 1) {
      const data = {
        category: args[0]
      };

      // ready-up switch
      _Bot.shared_props[Bot.getId().user]["twibbon"] = {
        status: true,
        source: {
          id: Bot.getId().origin
        }
      };

      display_list(data.category || "all");
    } else {
      Bot.replyText(`${_Bot.command_prefix}twibbon <type>`);
    }
  };

  const listen = data => {
    const { user } = Bot.getId();

    if (data.twibbon) {
      const { id, type } = data.twibbon;

      // ready-up switch
      _Bot.shared_props[user]["twibbon"] = {
        id: id,
        type: type,
        status: true,
        source: {
          id: Bot.getId().origin
        }
      };

      Bot.profile().then(res => {
        const messages = [`Hai ${res.displayName}, masukan gambar mu disini~`];
        if (type === "manual") {
          messages.push(`Pastikan 1:1 ya fotonya~\n\nTips: gunakan in-app camera line disamping kolom chat dan set ratio ke 1:1`);
        }
        Bot.replyText(messages);
      });
    }
  };

  const display_list = category => {
    let selected = [];
    if (category === "all") {
      selected = Object.keys(twibbon_list).map(twibbon_id => {
        return twibbon_id;
      });
    } else {
      selected = Object.keys(twibbon_list).map(twibbon_id => {
        if (twibbon_list[twibbon_id].category === category) {
          return twibbon_id;
        }
      });
    }

    const pure_selected = selected.filter(item => {
      return typeof item === "string";
    });

    if (pure_selected.length === 0) {
      Bot.replyText(`Tidak ada kategori, lihat di ${_Bot.command_prefix}twibbon`);
    }

    const twibbon_contents = pure_selected.map(id => {
      const { url, name } = twibbon_list[id];
      return {
        thumbnailImageUrl: url,
        imageBackgroundColor: "#FFFFFF",
        text: `${name}`,
        actions: [{
          type: "postback",
          label: "Auto-AI Mode",
          data: `{"twibbon":{"id":"${id}","type":"auto"}}`
        }, {
          type: "postback",
          label: "Manual Mode",
          data: `{"twibbon":{"id":"${id}","type":"manual"}}`
        }]
      };
    });

    Bot.sendMessage({
      type: "template",
      altText: "Twibbon list",
      template: {
        type: "carousel",
        columns: twibbon_contents,
        imageAspectRatio: "square",
        imageSize: "cover"
      }
    });
  };

  const getResult = (twibbon_setting, public_id, filename, size) => {
    const result = _cloudinary2.default.url(public_id, twibbon_list[twibbon_setting.id].transform(filename, size)[twibbon_setting.type]);
    return result;
  };

  const imgUpload = (url, filename) => {
    return new Promise((resolve, reject) => {
      _cloudinary2.default.uploader.upload(url, { public_id: filename }).then(image => {
        console.log("** File Upload (Promise)");
        console.log("* " + image.public_id);
        console.log("* " + image.url);
        resolve(image);
      }).catch(err => {
        console.log("** File Upload (Promise)");
        if (err) {
          console.warn(err);
          reject(err);
        }
      });
    });
  };

  const waitForAllUploads = (type, queue, imageObject, callback) => {
    uploads[type] = _extends({}, uploads[type], imageObject);
    const ids = Object.keys(uploads[type]);
    if (ids.length === queue) {
      console.log("**  uploaded all raw files (" + ids.join(",") + ") to cloudinary");
      callback();
    }
  };

  const generate = data => {
    return new Promise((resolve, reject) => {
      imgUpload(data.url, data.filename).then(image => {
        waitForAllUploads("raw", 1, {
          twibbon_bg: image
        }, performTransformations);
      });

      const performTransformations = () => {
        const twibbon_ori_name = `${data.filename}-twibbon`;
        const result_url = getResult(data.twibbonSetting, uploads.raw.twibbon_bg.public_id, twibbon_ori_name, 1040);

        const twibbon_preview_name = `${data.filename}-twibbon-preview`;
        const result_preview_url = getResult(data.twibbonSetting, uploads.raw.twibbon_bg.public_id, twibbon_preview_name, 240);

        imgUpload(result_url, twibbon_ori_name).then(image => {
          waitForAllUploads("twibbon", 2, {
            original: image
          }, performResolve);
        });

        imgUpload(result_preview_url, twibbon_preview_name).then(image => {
          waitForAllUploads("twibbon", 2, {
            preview: image
          }, performResolve);
        });

        const performResolve = () => {
          resolve({ twibbonOriginalUrl: `${uploads.twibbon.original.secure_url}`, twibbonPreviewUrl: `${uploads.twibbon.preview.secure_url}` });

          _fsExtra2.default.unlinkSync(data.originalPath);
          _fsExtra2.default.unlinkSync(data.previewPath);
        };
      };
    });
  };

  const make = args => {
    if (args.length === 4) {
      const data = {
        url: args[0],
        originalPath: args[1],
        previewPath: args[2],
        twibbonSetting: args[3],
        filename: Bot.props.event.message.id
      };

      generate(data).then(({ twibbonOriginalUrl, twibbonPreviewUrl }) => {
        Bot.sendMessage({ type: "image", originalContentUrl: twibbonOriginalUrl, previewImageUrl: twibbonPreviewUrl });
      });

      //switch back
      _Bot.shared_props[Bot.getId().user].twibbon.status = false;
    } else {
      Bot.replyText(`${_Bot.command_prefix}twibbon <image>`);
    }
  };

  const insert = getContent => {
    const { user } = Bot.getId();

    const userSwitch = _Bot.shared_props[user].twibbon.status === undefined ? false : _Bot.shared_props[user].twibbon.status;

    const userInSameCommunal = _Bot.shared_props[user].twibbon.source.id === Bot.getId().origin;

    const twibbon_id_chosen = _Bot.shared_props[user].twibbon.id !== undefined;

    if (userSwitch && userInSameCommunal && twibbon_id_chosen) {
      const twibbonSetting = {
        id: _Bot.shared_props[user].twibbon.id,
        type: _Bot.shared_props[user].twibbon.type
      };

      getContent().then(({ originalPath, previewPath, originalContentUrl, previewImageUrl }) => {
        make([originalContentUrl, originalPath, previewPath, twibbonSetting]);
      });
    }
  };

  return { ready, insert, listen };
};
//# sourceMappingURL=Twibbon.js.map