"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const status = url => {
  return new Promise((resolve, reject) => {
    (0, _request2.default)(url).on('response', response => {
      resolve(response.statusCode);
    });
  });
};

exports.default = {
  status
};
//# sourceMappingURL=ResponseCheck.js.map