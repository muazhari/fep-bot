"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodePersist = require("node-persist");

var _nodePersist2 = _interopRequireDefault(_nodePersist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// share worker props by groupId
// const shared_props = storage.create({});

const init = async () => {
  await _nodePersist2.default.init();
  await shared_props.init();
};

const setStore = async obj => {
  Object.keys(obj).map(async key => {
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

exports.default = {
  init,
  setStore,
  getStore,
  remStore,
  updStore
};
//# sourceMappingURL=Store.js.map