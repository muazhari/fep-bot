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

class SharedPropsFactory {
  constructor() {
    // this.store = {};
    this.store = (0, _observe2.default)({});
    // this.store = new Proxy({}, {
    //   set: this._set,
    //   get: this._get
    // });
    this.store.on("change", change => {
      this.storeUpdateListener();
    });
  }

  log(sourceId) {
    new Promise((resolve, reject) => {
      if (sourceId) {
        _Firebase2.default.fdb.collection("Props").add(this.store.get([sourceId]));
        console.log("[SharedProps] Props logged", sourceId, new Date());
      }
      // Firebase.fdb.collection("Store").add(this.store.get(""));
      console.log("[SharedProps] Store logged", new Date());
    });
  }

  storeUpdateListener() {
    // Firebase.rdb.ref("SharedProps").set(this.store.get(""));
    console.log("[SharedProps] Store updated", new Date());
  }
}

const SharedProps = new SharedPropsFactory();

exports.SharedProps = SharedProps;
//# sourceMappingURL=SharedProps.js.map