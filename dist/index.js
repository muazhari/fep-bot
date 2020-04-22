"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _app = require("./app");

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config({
  path: _path2.default.join(__dirname, "../.env")
});

const { PORT, BASE_URL } = process.env;

const baseURL = BASE_URL;

_app2.default.listen(PORT, () => {
  if (baseURL) {
    console.log(`listening on ${baseURL}:${PORT}`);
  } else {
    // ngrok.connect(PORT, (err, url) => {
    //   if (err) throw err;
    //   console.log(`listening on ${url}`);
    // });
  }
});
//# sourceMappingURL=index.js.map