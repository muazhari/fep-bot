"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PosetLattice = undefined;

var _Bot = require("../../Bot");

var _PosetLatticeGenerator = require("../../Bot/Helper/PosetLatticeGenerator");

var _PosetLatticeGenerator2 = _interopRequireDefault(_PosetLatticeGenerator);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _Store = require("../../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PosetLattice = exports.PosetLattice = Bot => {
  const make = data => {
    return new Promise((resolve, reject) => {
      _PosetLatticeGenerator2.default.run(data).then(result => resolve(JSON.parse(result))).catch(reject);
    });
  };

  const generate = args => {
    if (args.length >= 1) {
      const data = {};
      data["setList"] = args[0];
      data["relation"] = "divisible"; // only this feature available
      const fileName = Bot.getId().origin;
      data["filePath"] = _path2.default.join(__dirname, "../Helper/PosetLatticeGenerator", `${fileName}.jpg`);
      data["filePathPreview"] = _path2.default.join(__dirname, "../Helper/PosetLatticeGenerator", `${fileName}-preview.jpg`);

      console.log(data);
      make(data).then(result => {
        console.log(result);
        _child_process2.default.execSync(`convert -resize 240x jpg:${data.filePath} jpg:${data.filePathPreview}`);

        Bot.sendMessage({ type: "image", originalContentUrl: data.filePath, previewImageUrl: data.filePathPreview });

        Bot.replyText(result);

        _fsExtra2.default.unlinkSync(data.filePath);
        _fsExtra2.default.unlinkSync(data.filePathPreview);
      }).catch(err => {
        console.log("Error PosetLattice", err);
      });
    } else {
      Bot.replyText("/pl <setList> [edge] [node]");
    }
  };

  return { generate };
};
//# sourceMappingURL=PosetLattice.js.map