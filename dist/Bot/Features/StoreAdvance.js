"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StoreAdvance = undefined;

var _Bot = require("../../Bot");

var _FEPCleaner = require("../../Bot/Helper/FEPCleaner");

var _FEPCleaner2 = _interopRequireDefault(_FEPCleaner);

var _Store = require("../../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

var _nodePersist = require("node-persist");

var _nodePersist2 = _interopRequireDefault(_nodePersist);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultBackupUrl = "https://gist.githubusercontent.com/muazhari/38a5819eb228a20a693db0516e76bedb/raw/7716b10d92b526be02d94750c5cfc347ad7ed47d/feplist";

const StoreAdvance = exports.StoreAdvance = Bot => {
  const reset_store = async args => {
    if (args.length === 1) {
      await _Store2.default.setStore({ [args[0]]: {} });
      Bot.replyText("Done!");
    }
  };

  const pre_store = async args => {
    if (args.length === 1) {
      const data = {
        url: args[0]
      };

      const response = await (0, _axios2.default)({
        method: "get",
        url: data.url
        // responseType: "text"
      });

      console.log(typeof response.data);

      // const response = await FEPCleaner.run(data.url);
      // const parsed = JSON.parse(response);
      // console.log(parsed);

      await _Store2.default.setStore({ fep: response.data });
      Bot.replyText("Done!");
    } else {
      Bot.replyText(`${_Bot.command_prefix}pre_store <url>`);
    }
  };

  const backup_store = async args => {
    const headers = {
      "Content-type": "application/json"
    };

    const fep = await _Store2.default.getStore("fep");
    let backup = await _Store2.default.getStore("backup_fep");

    if (backup) {
      backup.splice(-20);
    } else {
      backup = [];
    }
    // const response = requests.post('https://paste.c-net.org/')

    const timeStamp = Date.now();

    backup.push([{ timeStamp: timeStamp, content: fep }]);

    await _Store2.default.setStore({ backup_fep: backup });

    if (args !== "silent") {
      Bot.replyText(`Done backup!\n${Date.now()}`);
    }
  };

  return {
    reset_store,
    pre_store,
    backup_store
  };
};
//# sourceMappingURL=StoreAdvance.js.map