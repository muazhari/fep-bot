'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { PORT } = process.env;

let baseURL = process.env.BASE_URL;

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