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

var _melankeWatchjs = require("melanke-watchjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SharedPropsFactory {
  constructor() {
    this.store = {};
    // this.store = new Proxy({}, {
    //   set: this._set,
    //   get: this._get
    // });

    (0, _melankeWatchjs.watch)(this.store, () => {
      this.storeUpdateListener();
    });
  }
  log(sourceId) {
    new Promise(async (resolve, reject) => {
      if (sourceId) {
        _Firebase2.default.fdb.collection("Props").add(this.store[sourceId]);
        console.log("[LOG] Props logged", sourceId, this.store[sourceId].event.timestamp);
      } else {
        _Firebase2.default.fdb.collection("Store").add(this.store);
        console.log("[LOG] Store logged", new Date());
      }
    });
  }

  storeUpdateListener() {
    _Firebase2.default.rdb.ref("SharedProps").set(this.store);
    console.log("[SharedStore] Store updated", new Date());
  }
}

const SharedProps = new SharedPropsFactory();

exports.SharedProps = SharedProps;
//# sourceMappingURL=SharedProps.js.map