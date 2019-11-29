"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _nodePersist = require("node-persist");

var _nodePersist2 = _interopRequireDefault(_nodePersist);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// share worker props by groupId
// const shared_props = storage.create({});

const logStorage = async () => {
   return _nodePersist2.default.create({
      dir: _path2.default.join(__dirname, "../src/Logs"),

      stringify: JSON.stringify,

      parse: JSON.parse,

      encoding: 'utf8',

      logging: true, // can also be custom logging function

      ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object

      expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache

      // in some cases, you (or some other service) might add non-valid storage files to your
      // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
      forgiveParseErrors: false

   });
};

const init = async () => {
   await _nodePersist2.default.init();
   await logStorage().init();
};

const setStore = async obj => {
   await Object.keys(obj).map(async key => {
      await _nodePersist2.default.setItem(key, obj[key]);
   });
};

const getStore = async storeName => {
   return await _nodePersist2.default.getItem(storeName);
};

const remStore = async storeName => {
   await _nodePersist2.default.removeItem(storeName);
};

const updStore = async (storeName, value) => {
   await _nodePersist2.default.updateItem(storeName, value);
};

exports.default = { init, setStore, getStore, remStore, updStore };
//# sourceMappingURL=Store.js.map