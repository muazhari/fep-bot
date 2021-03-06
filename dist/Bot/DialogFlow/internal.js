"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dialogFlow = require("./dialogFlow");

Object.keys(_dialogFlow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dialogFlow[key];
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