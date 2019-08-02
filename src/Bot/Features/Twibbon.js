import { command_prefix, batch_list, baseURL, shared_props } from "../../Bot";
import FEPStoreCRUD from "../../Bot/Helper/FEPStoreCRUD";
import cloudinary from "cloudinary";
import convert from "xml-js";
import fs from "fs";
import request from "request";
import cp from "child_process";
import path from "path";

const download = (uri, path) => {
  return new Promise((resolve, reject) => {
    request.head(uri, (err, res, body) => {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      request(uri)
        .pipe(fs.createWriteStream(path))
        .on("close", resolve(path))
        .on("error", reject);
    });
  });
};

export const Twibbon = Bot => {
  const uploads = {};
  const twibbon_uploads = {};
  
  const ready = () => {
    // ready-up switch
    shared_props[Bot.getId().user]['twibbon'] = true
    Bot.replyText('Masukan gambar mu langsung disini~')
    
  }

  const getResult = (public_id, filename, size) => {
    const result = cloudinary.url(public_id, {
      transformation: [
        {
          gravity: "auto",
          crop: "fill",
          format: "jpg",
          public_id: `${filename}-twibbon`
        },
        {
          gravity: "auto",
          crop: "fill_pad",
          width: size,
          height: size,
          y: -size*0.19,
          x: size*0.48
        },
        {
          overlay: "twibbon_cs.png",
          flags: "relative",
          width: size,
          height: size,
          aspect_ratio: "1:1"
        }
      ]
    });

    return result;
  };

  const imgUpload = (url, filename) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload(url, { public_id: filename })
        .then(image => {
          console.log("** File Upload (Promise)");
          console.log("* " + image.public_id);
          console.log("* " + image.url);
          resolve(image);
        })
        .catch(err => {
          console.log("** File Upload (Promise)");
          if (err) {
            console.warn(err);
            reject(err);
          }
        });
    });
  };

  const waitForAllUploads = (id, image, queue, callback) => {
    uploads[id] = image;
    const ids = Object.keys(uploads);
    if (ids.length === queue) {
      console.log(
        "**  uploaded all files (" + ids.join(",") + ") to cloudinary"
      );
      callback();
    }
  };

  const waitForAllUploadsTwibbon = (id, image, queue, callback) => {
    twibbon_uploads[id] = image;
    const ids = Object.keys(twibbon_uploads);
    if (ids.length === queue) {
      console.log(
        "**  uploaded all twibbon files (" + ids.join(",") + ") to cloudinary"
      );
      callback();
    }
  };

  const make = args => {
    if (args.length === 3) {
      const data = {
        url: args[0],
        path: args[1],
        filename: args[2]
      };

      console.log(data);

      return new Promise(async (resolve, reject) => {
        imgUpload(data.url, data.filename).then(image => {
          waitForAllUploads("twibbon_bg", image, 1, performTransformations);
        });

        const twibbon_ori_name = `${data.filename}-twibbon`;
        const performTransformations = () => {
          const result_url = getResult(
            uploads.twibbon_bg.public_id,
            twibbon_ori_name,
            1040
          );

          const twibbon_preview_name = `${data.filename}-twibbon-preview`;
          const result_preview_url = getResult(
            uploads.twibbon_bg.public_id,
            twibbon_preview_name,
            240
          );

          imgUpload(result_url, twibbon_ori_name).then(image => {
            waitForAllUploadsTwibbon("original", image, 2, performResolve);
          });

          imgUpload(result_preview_url, twibbon_preview_name).then(image => {
            waitForAllUploadsTwibbon("preview", image, 2, performResolve);
          });

          const performResolve = () => {
            resolve({
              twibbonOriginalUrl: `${twibbon_uploads.original.secure_url}`,
              twibbonPreviewUrl: `${twibbon_uploads.preview.secure_url}`
            })
          };
        };
      });
    } else {
      Bot.replyText(`${command_prefix}twibbon <image>`);
    }
  };

  return {
    make,
    ready,
  };
};
