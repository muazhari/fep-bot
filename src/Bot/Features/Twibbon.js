import { command_prefix, batch_list, baseURL } from "../../Bot";
import FEPStoreCRUD from "../../Bot/Helper/FEPStoreCRUD";
import cloudinary from "cloudinary";
import convert from "xml-js";
import fs from "fs";
import request from "request";
import path from "path";
import cp from "child_process";
import Store from "../../Services/Store";

const download = (uri, path) => {
  return new Promise((resolve, reject) => {
    request.head(uri, (err, res, body) => {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      request(uri)
        .pipe(fs.createWriteStream(path))
        .on("close", resolve())
        .on("error", reject);
    });
  });
};

export const Twibbon = Bot => {
  const uploads = {};

  const make = args => {
    if (args.length === 2) {
      const data = {
        path: args[0],
        filename: args[1]
      };

      console.log(data);

      return new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { tags: "twibbon_bg", public_id: data.filename },
          (err, image) => {
            console.log("** Stream Upload");
            if (err) {
              console.warn(err);
              reject(err);
            }
            console.log("* " + image.public_id);
            console.log("* " + image.url);
            waitForAllUploads("twibbon_bg", err, image);
          }
        );
        const file_reader = fs.createReadStream(data.path).pipe(upload_stream);

        const waitForAllUploads = (id, err, image) => {
          uploads[id] = image;
          const ids = Object.keys(uploads);
          if (ids.length === 1) {
            console.log(
              "**  uploaded all files (" + ids.join(",") + ") to cloudinary"
            );
            performTransformations();
          }
        };

        const performTransformations = () => {
          const result_url = cloudinary.url(uploads.twibbon_bg.public_id, {
            transformation: [
              {
                gravity: "auto",
                aspect_ratio: "1:1",
                crop: "fill",
                format: "jpg",
                width: 1040,
                height: 1040,
                public_id: `${data.filename}-twibbon`
              },
              {
                overlay: "twibbon_cs.png",
                flags: "relative",
                width: 1040,
                height: 1040,
                aspect_ratio: "1:1"
              }
            ]
          });

          const twibbonOriginalPath = path.join(
            __dirname,
            "../../src/Bot/Assets/twibbon",
            `${data.filename}-twibbon.jpg`
          );
          const twibbonPreviewPath = path.join(
            __dirname,
            "../../src/Bot/Assets/twibbon",
            `${data.filename}-twibbon-preview.jpg`
          );

          download(result_url, twibbonOriginalPath).then(() => {
            cp.execSync(
              `convert -resize 240x jpg:${twibbonOriginalPath} jpg:${twibbonPreviewPath}`
            );

            resolve({
              twibbonOriginalUrl: `${baseURL}/twibbons/${path.basename(
                twibbonOriginalPath
              )}`,
              twibbonPreviewUrl: `${baseURL}/twibbons/${path.basename(
                twibbonPreviewPath
              )}`
            });
          });
        };
      });
      Bot.replyText(`Done!\n${data.name} - ${data.campus} - ${data.room}`);
    } else {
      Bot.replyText(`${command_prefix}twibbon <image>`);
    }
  };

  return {
    make
  };
};
