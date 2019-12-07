"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Bot = require("./Bot");

Object.keys(_Bot).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Bot[key];
    }
  });
});

var _Services = require("./Services");

Object.keys(_Services).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Services[key];
    }
  });
});
//# sourceMappingURL=internal.js.map