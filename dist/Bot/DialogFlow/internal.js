"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DialogFlow = require("./DialogFlow");

Object.keys(_DialogFlow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _DialogFlow[key];
    }
  });
});
//# sourceMappingURL=internal.js.map