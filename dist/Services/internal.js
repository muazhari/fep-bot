"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Store = require("./Store");

Object.keys(_Store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Store[key];
    }
  });
});

var _Firebase = require("./Firebase");

Object.keys(_Firebase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Firebase[key];
    }
  });
});
//# sourceMappingURL=internal.js.map