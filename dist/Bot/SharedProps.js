"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedProps = undefined;

var _Store = require("../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _uuid = require("uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _Line = require("../Config/Line");

var _Line2 = _interopRequireDefault(_Line);

var _Firebase = require("../Services/Firebase");

var _Firebase2 = _interopRequireDefault(_Firebase);

var _observe = require("observe");

var _observe2 = _interopRequireDefault(_observe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isObject = item => {
  return item && typeof item === 'object' && !Array.isArray(item) && item !== null;
};

const merge = (oldObj, newObj) => {
  if (isObject(oldObj) && isObject(newObj)) {
    for (const key in newObj) {
      if (isObject(newObj[key])) {
        if (!oldObj[key]) {
          oldObj[key] = {};
        }
        merge(oldObj[key], newObj[key]);
      } else {
        oldObj[key] = newObj[key];
      }
    }
  }
  return oldObj;
};

class SharedPropsFactory {
  constructor() {
    this.store = {};
    // this.store = observe({});
    // this.store = new Proxy({}, {
    //   set: this._set,
    //   get: this._get
    // });
    // this.store.on("change", change => {
    //   this.storeUpdateListener();
    // });
  }

  set(newObj) {
    this.store = merge(this.store, newObj);
  }

  log(sourceId) {
    new Promise((resolve, reject) => {
      if (sourceId) {
        _Firebase2.default.fdb.collection("Props").add(this.store[sourceId]);
        console.log("[SharedProps] Props logged", sourceId, new Date());
      }
      _Firebase2.default.fdb.collection("Store").add(this.store);
      console.log("[SharedProps] Store logged", new Date());
    });
  }

  storeUpdateListener() {
    _Firebase2.default.rdb.ref("SharedProps").set(this.store);
    console.log("[SharedProps] Store updated", new Date());
  }
}

const SharedProps = new SharedPropsFactory();

exports.SharedProps = SharedProps;
//# sourceMappingURL=SharedProps.js.map