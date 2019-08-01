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

var _xmlJs = require("xml-js");

var _xmlJs2 = _interopRequireDefault(_xmlJs);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _Store = require("../../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const download = (uri, path) => {
  return new Promise((resolve, reject) => {
    _request2.default.head(uri, (err, res, body) => {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      (0, _request2.default)(uri).pipe(_fs2.default.createWriteStream(path)).on("close", resolve()).on("error", reject);
    });
  });
};

const Twibbon = exports.Twibbon = Bot => {
  const uploads = {};

  const make = args => {
    if (args.length === 2) {
      const data = {
        path: args[0],
        filename: args[1]
      };

      console.log(data);

      return new Promise((resolve, reject) => {
        const upload_stream = _cloudinary2.default.uploader.upload_stream({ tags: "twibbon_bg", public_id: data.filename }, (err, image) => {
          console.log("** Stream Upload");
          if (err) {
            console.warn(err);
            reject(err);
          }
          console.log("* " + image.public_id);
          console.log("* " + image.url);
          waitForAllUploads("twibbon_bg", err, image);
        });
        const file_reader = _fs2.default.createReadStream(data.path).pipe(upload_stream);

        const waitForAllUploads = (id, err, image) => {
          uploads[id] = image;
          const ids = Object.keys(uploads);
          if (ids.length === 1) {
            console.log("**  uploaded all files (" + ids.join(",") + ") to cloudinary");
            performTransformations();
          }
        };

        const performTransformations = () => {
          const result_url = _cloudinary2.default.url(uploads.twibbon_bg.public_id, {
            transformation: [{
              gravity: "auto",
              aspect_ratio: "1:1",
              crop: "fill",
              format: "jpg",
              width: 1040,
              height: 1040,
              public_id: `${data.filename}-twibbon`
            }, {
              overlay: "twibbon_cs.png",
              flags: "relative",
              width: 1040,
              height: 1040,
              aspect_ratio: "1:1"
            }]
          });

          const twibbonOriginalPath = _path2.default.join(__dirname, "../../src/Bot/Assets/twibbon", `${data.filename}-twibbon.jpg`);
          const twibbonPreviewPath = _path2.default.join(__dirname, "../../src/Bot/Assets/twibbon", `${data.filename}-twibbon-preview.jpg`);

          download(result_url, twibbonOriginalPath).then(() => {
            _child_process2.default.execSync(`convert -resize 240x jpg:${twibbonOriginalPath} jpg:${twibbonPreviewPath}`);

            resolve({
              twibbonOriginalUrl: `${_Bot.baseURL}/twibbons/${_path2.default.basename(twibbonOriginalPath)}`,
              twibbonPreviewUrl: `${_Bot.baseURL}/twibbons/${_path2.default.basename(twibbonPreviewPath)}`
            });
          });
        };
      });
      Bot.replyText(`Done!\n${data.name} - ${data.campus} - ${data.room}`);
    } else {
      Bot.replyText(`${_Bot.command_prefix}twibbon <image>`);
    }
  };

  return {
    make
  };
};
//# sourceMappingURL=Twibbon.js.map