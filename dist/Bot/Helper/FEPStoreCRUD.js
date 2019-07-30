"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _internal = require("../../Bot/internal");

var _nodePersist = require("node-persist");

var _nodePersist2 = _interopRequireDefault(_nodePersist);

var _Store = require("../../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { getStore, setStore } from "../../internal";


const set_store = async data => {
  const store = await _Store2.default.getStore("fep");
  if (Object.keys(_internal.batch_list).includes(data.batch)) {

    if (!Object.keys(store).includes(data.batch)) {
      store[data.batch] = [];
    }

    const selected_user_data = [data.name, data.campus, data.room];
    store[data.batch].push(selected_user_data);
    await _Store2.default.setStore({ fep: store });
  }
};

const update_store = async data => {
  const store = await _Store2.default.getStore("fep");
  if (Object.keys(_internal.batch_list).includes(data.batch)) {
    const selected_user_data = [data.name, data.campus, data.room];
    store[data.batch][parseInt(data.num, 10) - 1] = selected_user_data;
    await _Store2.default.setStore({ fep: store });
  }
};

const delete_store = async data => {
  const store = await _Store2.default.getStore("fep");

  if (store[data.batch].length > 0) {
    store[data.batch].splice(parseInt(data.num, 10) - 1, 1);
  }

  await _Store2.default.setStore({ fep: store });
};

exports.default = {
  set_store,
  delete_store,
  update_store
};
//# sourceMappingURL=FEPStoreCRUD.js.map