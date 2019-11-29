"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _photoEditor = require("./photoEditor");

Object.keys(_photoEditor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _photoEditor[key];
    }
  });
});
//# sourceMappingURL=internal.js.map