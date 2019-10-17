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

var _handlerBot = require("./handlerBot");

Object.keys(_handlerBot).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _handlerBot[key];
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

var _handlerDialogFlow = require("./handlerDialogFlow");

Object.keys(_handlerDialogFlow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _handlerDialogFlow[key];
    }
  });
});
//# sourceMappingURL=internal.js.map