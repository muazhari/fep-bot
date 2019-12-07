"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedProps = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Firebase = require("../Services/Firebase");

var _Firebase2 = _interopRequireDefault(_Firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SharedPropsFactory {
  constructor() {
    this.store = new Proxy(this.store, {
      set: (obj, prop, newval) => {
        var oldval = obj[prop];
        console.log("set", oldval, obj, prop, newval);
        obj[prop] = newval;
        this.storeUpdateListener();
      },
      get: (obj, prop) => {
        console.log("get", obj, prop);
      }
    });
  }

  get(key) {
    if (key) {
      return this.store[key];
    } else {
      return this.store;
    }
  }

  storeUpdateListener() {
    _Firebase2.default.rdb.ref("SharedProps").set(this.store);
  }

  set(props) {
    Object.keys(props).forEach(key => {
      this.store[key] = _extends({}, this.store[key], props[key]);
    });

    this.updateStore();
  }
}

const SharedProps = new SharedPropsFactory();

exports.SharedProps = SharedProps;
//# sourceMappingURL=SharedProps.js.map