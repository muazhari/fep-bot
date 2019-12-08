"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedProps = undefined;

var _Firebase = require("../Services/Firebase");

var _Firebase2 = _interopRequireDefault(_Firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SharedPropsFactory {
  constructor() {
    // this.store = {};
    this.store = new Proxy({}, {
      set: this._set,
      get: this._get
    });
  }

  _set(obj, prop, newVal) {
    const oldval = obj[prop];
    console.log("set", oldval, obj, prop, newval);
    obj[prop] = newVal;
    this.storeUpdateListener();
    return true;
  }

  _get(obj, prop) {
    console.log("get", obj, prop);
    return obj[prop];
  }

  storeUpdateListener() {
    _Firebase2.default.rdb.ref("SharedProps").set(this.store);
  }
}

const SharedProps = new SharedPropsFactory();

exports.SharedProps = SharedProps;
//# sourceMappingURL=SharedProps.js.map