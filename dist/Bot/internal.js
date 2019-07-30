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

var _Handler = require("./Handler");

Object.keys(_Handler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Handler[key];
    }
  });
});

var _Features = require("./Features");

Object.keys(_Features).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Features[key];
    }
  });
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