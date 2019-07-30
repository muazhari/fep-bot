'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { PORT = 8080 } = process.env;

let baseURL = process.env.BASE_URL;

_app2.default.listen(PORT, () => {
  if (baseURL) {
    console.log(`listening on ${baseURL}:${PORT}`);
  } else {
    //     console.log("It seems that BASE_URL is not set. Connecting to ngrok...")
    //     ngrok.connect(PORT, (err, url) => {
    //       if (err) throw err;

    //       baseURL = url;
    //       console.log(`listening on ${baseURL}`);
    //     });
  }
});
//# sourceMappingURL=index.js.map