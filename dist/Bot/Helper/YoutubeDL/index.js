"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _youtubeDl = require("youtube-dl");

var _youtubeDl2 = _interopRequireDefault(_youtubeDl);

var _ResponseCheck = require("../../../Bot/Helper/ResponseCheck");

var _ResponseCheck2 = _interopRequireDefault(_ResponseCheck);

var _Store = require("../../../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class YoutubeDL {
  constructor(url) {
    this.url = url;
    this.getInfo = this.getInfo.bind(this);
    this.generateUrl = this.generateUrl.bind(this);
  }

  getInfo(res) {
    const resolution = res || 480;
    // const options = [`-f 'bestvideo[height<=${resolution}]+bestaudio/best[height<=${resolution}]'`]
    const options = [];

    return new Promise((resolve, reject) => {
      _youtubeDl2.default.getInfo(this.url, options, (err, info) => {
        if (err) {
          reject(err);
          throw err;
        }
        return resolve(info);
      });
    });
  }

  generateUrl(urlName, options) {
    return new Promise((resolve, reject) => {
      _Store2.default.getStore("urlCache").then(urlCache => {
        if (urlCache && urlCache[urlName] && options.force === false) {
          _ResponseCheck2.default.status(urlCache[urlName].url).then(urlStatus => {
            if (urlStatus !== 200) {
              this.getInfo().then(({ url, thumbnail }) => {
                urlCache[urlName] = {
                  url,
                  thumbnail
                };
                _Store2.default.setStore({ urlCache: urlCache }).then(() => {
                  resolve({ url, thumbnail });
                });
              }).catch(reject);
            } else {
              resolve(urlCache[urlName]);
            }
          });
        } else {
          urlCache = {};
          this.getInfo().then(({ url, thumbnail }) => {
            urlCache[urlName] = {
              url,
              thumbnail
            };
            _Store2.default.setStore({ urlCache: urlCache }).then(() => {
              resolve(urlCache[urlName]);
            });
          }).catch(reject);
        }
      });
    });
  }
}
exports.default = YoutubeDL;
//# sourceMappingURL=index.js.map