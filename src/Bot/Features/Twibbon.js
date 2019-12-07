import { command_prefix, batch_list, baseURL, shared_props } from "../../Bot";
import FEPStoreCRUD from "../../Bot/Helper/FEPStoreCRUD";
import CloudinaryUtils from "../../Bot/Helper/CloudinaryUtils";
import cloudinary from "cloudinary";
import fs from "fs-extra";
import request from "request";
import cp from "child_process";
import path from "path";

const objectsHaveSameKeys = (...objects) => {
  const allKeys = objects.reduce(
    (keys, object) => keys.concat(Object.keys(object)),
    []
  );
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
};

export const Twibbon = Bot => {
  const uploads = {};

  const manual_transform = (twibbon_overlay, filename, size) => {
    return {
      transformation: [
        {
          crop: "fit",
          width: size,
          height: size,
          format: "jpg",
          public_id: `${filename}-twibbon`
        },
        {
          overlay: twibbon_overlay,
          flags: "relative",
          width: size,
          height: size,
          aspect_ratio: "1:1"
        }
      ]
    };
  };

  const twibbon_list = {
    twibbon_cs: {
      category: "socs",
      name: "Computer Science",
      url:
        "https://res.cloudinary.com/fep-bot/image/upload/v1564639746/twibbon_cs.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [
              {
                gravity: "auto",
                crop: "fill",
                format: "jpg",
                aspect_ratio: "1:1",
                public_id: `${filename}-twibbon`
              },
              {
                gravity: "auto",
                crop: "fill_pad",
                width: size,
                height: size,
                y: Math.floor(-size * 0.2),
                x: Math.floor(size * 0.045)
              },
              {
                overlay: "twibbon_cs.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          },
          manual: {
            transformation: [
              {
                crop: "fit",
                format: "jpg",
                width: size,
                height: size,
                public_id: `${filename}-twibbon`
              },
              {
                overlay: "twibbon_cs.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          }
        };
      }
    },

    twibbon_tfi: {
      category: "tfi",
      name: "Teach For Indonesia",
      url:
        "https://res.cloudinary.com/fep-bot/image/upload/v1565361689/twibbon_tfi.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [
              {
                gravity: "auto",
                crop: "fill",
                format: "jpg",
                // aspect_ratio: "1:1",
                width: size + Math.floor(-size * 0.045),
                height: size + Math.floor(size * 0.2),
                x: Math.floor(size * 0.045),
                y: Math.floor(-size * 0.2),
                public_id: `${filename}-twibbon`
              },
              {
                gravity: "auto",
                crop: "fill",
                width: size,
                height: size
              },
              {
                overlay: "twibbon_tfi.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          },
          manual: {
            transformation: [
              {
                crop: "fit",
                format: "jpg",
                // aspect_ratio: "1:1",
                width: size,
                height: size,
                public_id: `${filename}-twibbon`
              },
              {
                overlay: "twibbon_tfi.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          }
        };
      }
    },

    twibbon_binus1: {
      category: "binus",
      name: "Binus 1",
      url:
        "https://res.cloudinary.com/fep-bot/image/upload/v1565372081/twibbon_binus1.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [
              {
                gravity: "auto",
                crop: "fill",
                format: "jpg",
                // aspect_ratio: "1:1",
                width: size - Math.floor(size * 0.2),
                height: size - Math.floor(size * 0.2),
                public_id: `${filename}-twibbon`
              },
              {
                overlay: "twibbon_binus1.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          },
          manual: {
            transformation: [
              {
                crop: "fit",
                format: "jpg",
                // aspect_ratio: "1:1",
                width: size - Math.floor(size * 0.2125),
                height: size - Math.floor(size * 0.2),
                public_id: `${filename}-twibbon`
              },
              {
                overlay: "twibbon_binus1.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          }
        };
      }
    },

    twibbon_binus2: {
      category: "binus",
      name: "Binus 2",
      url:
        "https://res.cloudinary.com/fep-bot/image/upload/v1565372079/twibbon_binus2.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [
              {
                gravity: "auto",
                crop: "fill",
                format: "jpg",
                // aspect_ratio: "1:1",
                width: size - Math.floor(size * 0.225),
                height: size - Math.floor(size * 0.225),
                public_id: `${filename}-twibbon`
              },
              {
                overlay: "twibbon_binus2.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          },
          manual: {
            transformation: [
              {
                crop: "fit",
                format: "jpg",
                // aspect_ratio: "1:1",
                width: size - Math.floor(size * 0.225),
                height: size - Math.floor(size * 0.225),
                public_id: `${filename}-twibbon`
              },
              {
                overlay: "twibbon_binus2.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          }
        };
      }
    },

    twibbon_binus3: {
      category: "binus",
      name: "Binus 3",
      url:
        "https://res.cloudinary.com/fep-bot/image/upload/v1565372078/twibbon_binus3.png",
      transform: (filename, size) => {
        return {
          auto: {
            transformation: [
              {
                gravity: "auto",
                crop: "fill",
                format: "jpg",
                // aspect_ratio: "1:1",
                width: size - Math.floor(size * 0.225),
                height: size - Math.floor(size * 0.225),
                public_id: `${filename}-twibbon`
              },
              {
                overlay: "twibbon_binus3.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
          },
          manual: {
            transformation: [
              {
                crop: "fit",
                format: "jpg",
                // aspect_ratio: "1:1",
                width: size - Math.floor(size * 0.225),
                height: size - Math.floor(size * 0.225),
                public_id: `${filename}-twibbon`
              },
              {
                overlay: "twibbon_binus3.png",
                flags: "relative",
                width: size,
                height: size,
                aspect_ratio: "1:1"
              }
            ]
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
      shared_props[Bot.getId().user]["twibbon"] = {
        status: true,
        source: {
          id: Bot.getId().origin
        }
      };

      displayList(data.category || "all");
    } else {
      Bot.replyText(`${command_prefix}twibbon <type>`);
    }
  };

  const listen = data => {
    const { userId } = Bot.getId();

    if (data.twibbon) {
      const { id, type } = data.twibbon;

      // ready-up switch
      shared_props[user]["twibbon"] = {
        id: id,
        type: type,
        status: true,
        source: {
          id: Bot.getId().origin
        }
      };

      Bot.getProfile().then(res => {
        const messages = [`Hai ${res.displayName}, masukan gambar mu disini~`];
        if (type === "manual") {
          messages.push(
            `Pastikan 1:1 ya fotonya~\n\nTips: gunakan in-app camera line disamping kolom chat dan set ratio ke 1:1`
          );
        }
        Bot.replyText(messages);
      });
    }
  };

  const displayList = category => {
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

    if (selected.length > 0) {
      const twibbonColumns = selected.map(id => {
        const { url, name } = twibbon_list[id];
        return {
          thumbnailImageUrl: url,
          imageBackgroundColor: "#FFFFFF",
          text: `${name}`,
          actions: [
            {
              type: "postback",
              label: "Auto-AI Mode",
              data: `{"twibbon":{"id":"${id}","type":"auto"}}`
            },
            {
              type: "postback",
              label: "Manual Mode",
              data: `{"twibbon":{"id":"${id}","type":"manual"}}`
            }
          ]
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
    } else {
      Bot.replyText(`Tidak ada kategori, lihat di ${command_prefix}twibbon`);
    }
  };

  const getTransformedFileUrl = (twibbonSetting, publicId, filename, size) => {
    const result = cloudinary.url(
      publicId,
      twibbon_list[twibbonSetting.id].transform(filename, size)[
        twibbonSetting.type
      ]
    );
    return result;
  };

  const generate = data => {
    return new Promise((resolve, reject) => {
      CloudinaryUtils.upload(data.url, data.filename).then(
        twibbonBackgroundMeta => {
          performTransformations(twibbonBackgroundMeta);
        }
      );

      const performTransformations = twibbonBackgroundMeta => {
        const twibbonOriginalName = `${data.filename}-twibbon`;
        const resultOriginalUrl = getTransformedFileUrl(
          data.twibbonSetting,
          twibbonBackgroundMeta.public_id,
          twibbonOriginalName,
          1040
        );

        const twibonPreviewName = `${data.filename}-twibbon-preview`;
        const resultPreviewUrl = getTransformedFileUrl(
          data.twibbonSetting,
          twibbonBackgroundMeta.public_id,
          twibonPreviewName,
          240
        );

        Promise.all([
          CloudinaryUtils.upload(resultOriginalUrl, twibbonOriginalName),
          CloudinaryUtils.upload(resultPreviewUrl, twibonPreviewName)
        ]).then(fileMeta => {
          resolve({
            twibbonOriginalUrl: `${fileMeta[0].secure_url}`,
            twibbonPreviewUrl: `${fileMeta[1].secure_url}`
          });

          fs.unlinkSync(data.originalPath);
          fs.unlinkSync(data.previewPath);
        });
      };
    });
  };

  const make = args => {
    const data = {
      url: args[0],
      originalPath: args[1],
      previewPath: args[2],
      twibbonSetting: args[3],
      filename: Bot.props.event.message.id
    };

    generate(data).then(({ twibbonOriginalUrl, twibbonPreviewUrl }) => {
      Bot.sendMessage({
        type: "image",
        originalContentUrl: twibbonOriginalUrl,
        previewImageUrl: twibbonPreviewUrl
      });
    });

    //switch back
    shared_props[Bot.getId().user].twibbon.status = false;
  };

  const insert = getContent => {
    const { userId, originId } = Bot.getId();

    if (shared_props[userId].twibbon) {
      const userSwitch = shared_props[userId].twibbon.status;

      const userInSameCommunal =
        shared_props[userId].twibbon.source.id === originId;

      const twibbonIdChosen = shared_props[userId].twibbon.id !== undefined;

      if (userSwitch && userInSameCommunal && twibbonIdChosen) {
        const twibbonSetting = {
          id: shared_props[userId].twibbon.id,
          type: shared_props[userId].twibbon.type
        };

        getContent().then(
          ({
            originalPath,
            previewPath,
            originalContentUrl,
            previewImageUrl
          }) => {
            make([
              originalContentUrl,
              originalPath,
              previewPath,
              twibbonSetting
            ]);
          }
        );
      }
    }
  };

  return { ready, insert, listen };
};
