"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Twibbon = undefined;

var _Bot = require("../../Bot");

var _FEPStoreCRUD = require("../../Bot/Helper/FEPStoreCRUD");

var _FEPStoreCRUD2 = _interopRequireDefault(_FEPStoreCRUD);

var _cloudinary = require("cloudinary");

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const download = (uri, path) => {
  return new Promise((resolve, reject) => {
    _request2.default.head(uri, (err, res, body) => {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      (0, _request2.default)(uri).pipe(_fs2.default.createWriteStream(path)).on("close", resolve(path)).on("error", reject);
    });
  });
};

const Twibbon = exports.Twibbon = Bot => {
  const uploads = {};
  const twibbon_uploads = {};

  const ready = () => {
    // ready-up switch
    _Bot.shared_props[Bot.getId().user]["twibbon"] = true;
    Bot.replyText("Masukan gambar mu langsung disini~");
  };

  const getResult = (public_id, filename, size) => {
    const result = _cloudinary2.default.url(public_id, {
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
    });

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

  const waitForAllUploads = (id, image, queue, callback) => {
    uploads[id] = image;
    const ids = Object.keys(uploads);
    if (ids.length === queue) {
      console.log("**  uploaded all files (" + ids.join(",") + ") to cloudinary");
      callback();
    }
  };

  const waitForAllUploadsTwibbon = (id, image, queue, callback) => {
    twibbon_uploads[id] = image;
    const ids = Object.keys(twibbon_uploads);
    if (ids.length === queue) {
      console.log("**  uploaded all twibbon files (" + ids.join(",") + ") to cloudinary");
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
          const result_url = getResult(uploads.twibbon_bg.public_id, twibbon_ori_name, 1040);

          const twibbon_preview_name = `${data.filename}-twibbon-preview`;
          const result_preview_url = getResult(uploads.twibbon_bg.public_id, twibbon_preview_name, 240);

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
            });

            _fs2.default.unlinkSync(data.path.pathOri);
            _fs2.default.unlinkSync(data.path.pathPrev);
          };
        };
      });
    } else {
      Bot.replyText(`${_Bot.command_prefix}twibbon <image>`);
    }
  };

  return {
    make,
    ready
  };
};
//# sourceMappingURL=Twibbon.js.map