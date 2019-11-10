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
//# sourceMappingURL=internal.js.map