"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Twibbon = undefined;

var _Bot = require("../../Bot");

var _FEPStoreCRUD = require("../../Bot/Helper/FEPStoreCRUD");

var _FEPStoreCRUD2 = _interopRequireDefault(_FEPStoreCRUD);

var _CloudinaryUtils = require("../../Bot/Helper/CloudinaryUtils");

var _CloudinaryUtils2 = _interopRequireDefault(_CloudinaryUtils);

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

const objectsHaveSameKeys = (...objects) => {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
};

const Twibbon = exports.Twibbon = Bot => {
  const {
    user: userId,
    origin: originId
  } = Bot.getId();

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

  const twibbon_list = [{
    id: "twibbon_covid",
    category: "covid",
    name: "Covid #DiRumahAja",
    url: "https://res.cloudinary.com/fep-bot/image/upload/v1585597597/twibbons/twibbon_covid.png",
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
            overlay: "twibbons:twibbon_covid.png",
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
            overlay: "twibbons:twibbon_covid.png",
            flags: "relative",
            width: size,
            height: size,
            aspect_ratio: "1:1"
          }]
        }
      };
    }
  }, {
    id: "twibbon_cs",
    category: "socs",
    name: "Computer Science",
    url: "https://res.cloudinary.com/fep-bot/image/upload/v1564639746/twibbons/twibbon_cs.png",
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
            overlay: "twibbons:twibbon_cs.png",
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
            overlay: "twibbons:twibbon_cs.png",
            flags: "relative",
            width: size,
            height: size,
            aspect_ratio: "1:1"
          }]
        }
      };
    }
  }, {
    id: "twibbon_tfi",
    category: "tfi",
    name: "Teach For Indonesia",
    url: "https://res.cloudinary.com/fep-bot/image/upload/v1585599615/twibbons/twibbon_tfi.png",
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
            overlay: "twibbons:twibbon_tfi.png",
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
            overlay: "twibbons:twibbon_tfi.png",
            flags: "relative",
            width: size,
            height: size,
            aspect_ratio: "1:1"
          }]
        }
      };
    }
  }, {
    id: "twibbon_binus1",
    category: "binus",
    name: "Binus 1",
    url: "https://res.cloudinary.com/fep-bot/image/upload/v1565372081/twibbons/twibbon_binus1.png",
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
            overlay: "twibbons:twibbon_binus1.png",
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
            overlay: "twibbons:twibbon_binus1.png",
            flags: "relative",
            width: size,
            height: size,
            aspect_ratio: "1:1"
          }]
        }
      };
    }
  }, {
    id: "twibbon_binus2",
    category: "binus",
    name: "Binus 2",
    url: "https://res.cloudinary.com/fep-bot/image/upload/v1585598545/twibbons/twibbon_binus2.png",
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
            overlay: "twibbons:twibbon_binus2.png",
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
            overlay: "twibbons:twibbon_binus2.png",
            flags: "relative",
            width: size,
            height: size,
            aspect_ratio: "1:1"
          }]
        }
      };
    }
  }, {
    id: "twibbon_binus3",
    category: "binus",
    name: "Binus 3",
    url: "https://res.cloudinary.com/fep-bot/image/upload/v1585598544/twibbons/twibbon_binus3.png",
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
            overlay: "twibbons:twibbon_binus3.png",
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
            overlay: "twibbons:twibbon_binus3.png",
            flags: "relative",
            width: size,
            height: size,
            aspect_ratio: "1:1"
          }]
        }
      };
    }
  }];

  const ready = args => {
    if (args.length <= 1) {
      const data = {
        category: args[0]
      };

      // ready-up switch
      _Bot.SharedProps.set({
        [userId]: {
          twibbon: {
            id: null,
            type: null,
            status: true,
            source: {
              id: originId
            }
          }
        }
      });

      displayList(data.category);
    } else {
      Bot.replyText(`${_Bot.command_prefix}twibbon <type>`);
    }
  };

  const displayList = category => {
    let selected = twibbon_list.filter(twibbon => typeof twibbon.category === "string");

    if (category) {
      selected = selected.filter(twibbon => twibbon.category == category);
      if (selected.length === 0) {
        return Bot.replyText(`Tidak ada kategori, lihat di ${_Bot.command_prefix}twibbon`);
      }
    }

    const twibbonColumns = selected.map(twibbon => {
      return {
        thumbnailImageUrl: twibbon.url,
        imageBackgroundColor: "#FFFFFF",
        text: twibbon.name,
        actions: [{
          type: "postback",
          label: "Auto-AI Mode",
          data: JSON.stringify({
            twibbon: {
              id: twibbon.id,
              type: "auto"
            }
          })
        }, {
          type: "postback",
          label: "Manual Mode",
          data: JSON.stringify({
            twibbon: {
              id: twibbon.id,
              type: "manual"
            }
          })
        }]
      };
    });

    Bot.sendMessage({
      type: "template",
      altText: "Twibbon list",
      template: {
        type: "carousel",
        columns: twibbonColumns,
        imageAspectRatio: "square",
        imageSize: "cover"
      }
    });
  };

  const listenPostback = data => {
    if (data.twibbon) {
      const {
        twibbon
      } = data;

      // ready-up switch
      _Bot.SharedProps.set({
        [userId]: {
          twibbon: {
            id: twibbon.id,
            type: twibbon.type,
            status: true,
            source: {
              id: originId
            }
          }
        }
      });

      Bot.getProfile().then(profile => {
        const messages = [`Hai ${profile.displayName}, masukin gambar mu disini ya!`];
        if (twibbon.type === "manual") {
          messages.push(`Pastikan 1:1 ya fotonya~\n\nTips: gunakan in-app camera line disamping kolom chat dan set ratio ke 1:1`);
        }
        Bot.replyText(messages);
      });
    }
  };

  const getTransformedFileUrl = (twibbonSetting, publicId, filename, size) => {
    const getTwibbonById = twibbon_list.filter(twibbon => twibbon.id === twibbonSetting.id)[0];
    const result = _cloudinary2.default.url(publicId, getTwibbonById.transform(filename, size)[twibbonSetting.type]);
    return result;
  };

  const generate = data => {
    return new Promise((resolve, reject) => {
      _CloudinaryUtils2.default.upload(data.url, data.filename).then(twibbonBackgroundMeta => {
        performTransformations(twibbonBackgroundMeta);
      });

      const performTransformations = twibbonBackgroundMeta => {
        const twibbonOriginalName = `${data.filename}-twibbon`;
        const resultOriginalUrl = getTransformedFileUrl(data.twibbonSetting, twibbonBackgroundMeta.public_id, twibbonOriginalName, 1040);

        const twibonPreviewName = `${data.filename}-twibbon-preview`;
        const resultPreviewUrl = getTransformedFileUrl(data.twibbonSetting, twibbonBackgroundMeta.public_id, twibonPreviewName, 240);

        Promise.all([_CloudinaryUtils2.default.upload(resultOriginalUrl, twibbonOriginalName), _CloudinaryUtils2.default.upload(resultPreviewUrl, twibonPreviewName)]).then(fileMeta => {
          resolve({
            twibbonOriginalUrl: fileMeta[0].secure_url,
            twibbonPreviewUrl: fileMeta[1].secure_url
          });

          _fsExtra2.default.unlinkSync(data.originalContentPath);
          _fsExtra2.default.unlinkSync(data.previewPath);
        });
      };
    });
  };

  const make = args => {
    const data = {
      url: args[0],
      originalContentPath: args[1],
      previewPath: args[2],
      twibbonSetting: args[3],
      filename: Bot.props.event.message.id
    };

    generate(data).then(({
      twibbonOriginalUrl,
      twibbonPreviewUrl
    }) => {
      Bot.sendMessage({
        type: "image",
        originalContentUrl: twibbonOriginalUrl,
        previewImageUrl: twibbonPreviewUrl
      });
    });

    //switch back
    _Bot.SharedProps.set({
      [userId]: {
        twibbon: {
          id: null,
          type: null,
          status: false,
          source: {
            id: originId
          }
        }
      }
    });
  };

  const listenImage = getContent => {
    if (!_Bot.SharedProps.store[userId].twibbon) {
      return false;
    }

    const userSwitch = _Bot.SharedProps.store[userId].twibbon.status;
    const userInSameCommunal = _Bot.SharedProps.store[userId].twibbon.source.id === originId;
    const twibbonIdChosen = _Bot.SharedProps.store[userId].twibbon.id !== undefined;

    if (!(userSwitch && userInSameCommunal && twibbonIdChosen)) {
      return false;
    }

    const twibbonSetting = {
      id: _Bot.SharedProps.store[userId].twibbon.id,
      type: _Bot.SharedProps.store[userId].twibbon.type
    };

    getContent().then(({
      originalContentPath,
      previewPath,
      originalContentUrl,
      previewImageUrl
    }) => {
      make([originalContentUrl, originalContentPath, previewPath, twibbonSetting]);
    });

    return true;
  };

  return {
    ready,
    listenImage,
    listenPostback
  };
};
//# sourceMappingURL=Twibbon.js.map