import {command_prefix, batch_list, baseURL, shared_props} from "../../Bot";
import FEPStoreCRUD from "../../Bot/Helper/FEPStoreCRUD";
import cloudinary from "cloudinary";
import fs from "fs-extra";
import request from "request";
import cp from "child_process";
import path from "path";

function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
}

export const Twibbon = Bot => {
  const uploads = {};

  const twibbon_list = {
    twibbon_cs: {
      name: "Computer Science",
      url: "https://res.cloudinary.com/fep-bot/image/upload/v1564639746/twibbon_cs.png",
      transform: (filename, size) => {
        return {
          transformation: [
            {
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
            }
          ]
        }
      }
    },

    twibbon_tfi: {
      name: "Teach For Indonesia",
      url: "https://res.cloudinary.com/fep-bot/image/upload/v1565361689/twibbon_tfi.png",
      transform: (filename, size) => {
        return {
          transformation: [
            {
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
              overlay: "twibbon_tfi.png",
              flags: "relative",
              width: size,
              height: size,
              aspect_ratio: "1:1"
            }
          ]
        }
      }
    }

  }

  const ready = () => {
    // ready-up switch
    shared_props[Bot.getId().user]["twibbon"] = {
      status: true,
      source: {
        id: Bot.getId().default
      }
    };

    display_list()
  };

  const listen = async (data) => {
    const {user} = Bot.getId()
    if (data.twibbon) {
      const {id, type} = data.twibbon
      shared_props[user].twibbon = {
        ...shared_props[user].twibbon,
        id: id,
        type: type,
        status: true
      }
      const profile = await Bot.profile()
      Bot.replyText(`Hai ${profile.displayName}, Masukan gambar mu disini~`)
    }
  }

  const display_list = () => {
    const twibbon_contents = Object.keys(twibbon_list).map(id => {
      const {url, name} = twibbon_list[id]
      return {
        "thumbnailImageUrl": url,
        "imageBackgroundColor": "#FFFFFF",
        "text": `${name}`,
        "actions": [
          {
            "type": "postback",
            "label": "Select",
            "data": `{"twibbon":{"id":"${id}","type":"auto"}}`
          }
        ]
      }

    })

    Bot.sendMessage({
      "type": "template",
      "altText": "Twibbon list",
      "template": {
        "type": "carousel",
        "columns": twibbon_contents,
        "imageAspectRatio": "square",
        "imageSize": "cover"
      }
    })
  }

  const getResult = (twibbon_id, public_id, filename, size) => {
    const result = cloudinary.url(public_id, twibbon_list[twibbon_id].transform(filename, size))
    return result;
  };

  const imgUpload = (url, filename) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(url, {public_id: filename}).then(image => {
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
    uploads[type] = {
      ...uploads[type],
      ...imageObject
    };
    const ids = Object.keys(uploads[type]);
    if (ids.length === queue) {
      console.log("**  uploaded all raw files (" + ids.join(",") + ") to cloudinary");
      callback();
    }

  };

  const generate = (data) => {
    return new Promise(async (resolve, reject) => {
      imgUpload(data.url, data.filename).then(image => {
        waitForAllUploads("raw", 1, {
          twibbon_bg: image
        }, performTransformations);
      });

      const performTransformations = () => {
        const twibbon_ori_name = `${data.filename}-twibbon`;
        const result_url = getResult(data.twibbonSetting.id, uploads.raw.twibbon_bg.public_id, twibbon_ori_name, 1040);

        const twibbon_preview_name = `${data.filename}-twibbon-preview`;
        const result_preview_url = getResult(data.twibbonSetting.id, uploads.raw.twibbon_bg.public_id, twibbon_preview_name, 240);

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
          resolve({twibbonOriginalUrl: `${uploads.twibbon.original.secure_url}`, twibbonPreviewUrl: `${uploads.twibbon.preview.secure_url}`});

          fs.unlinkSync(data.originalPath);
          fs.unlinkSync(data.previewPath);
        };
      };
    });
  }

  const make = args => {
    if (args.length === 4) {
      const data = {
        url: args[0],
        originalPath: args[1],
        previewPath: args[2],
        twibbonSetting: args[3],
        filename: Bot.props.event.message.id
      };

      generate(data).then(({twibbonOriginalUrl, twibbonPreviewUrl}) => {
        Bot.sendMessage({type: "image", originalContentUrl: twibbonOriginalUrl, previewImageUrl: twibbonPreviewUrl});
      })

      //switch back
      shared_props[Bot.getId().user].twibbon.status = false

    } else {
      Bot.replyText(`${command_prefix}twibbon <image>`);
    }
  };

  const insert = (getContent) => {
    const {user} = Bot.getId()

    const userSwitch = shared_props[user].twibbon.status === undefined
      ? false
      : shared_props[user].twibbon.status;

    const userInSameCommunal = shared_props[user].twibbon.source.id === Bot.getId().default

    const twibbon_id_chosen = shared_props[user].twibbon.id !== undefined

    if (userSwitch && userInSameCommunal && twibbon_id_chosen) {
      const twibbonSetting = {
        id: shared_props[user].twibbon.id,
        type: shared_props[user].twibbon.type
      }

      getContent().then(({originalPath, previewPath, originalContentUrl, previewImageUrl}) => {
        make([originalContentUrl, originalPath, previewPath, twibbonSetting])
      });
    }

  }

  return {ready, insert, listen};
};
