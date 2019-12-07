'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _youtubeDl = require('youtube-dl');

var _youtubeDl2 = _interopRequireDefault(_youtubeDl);

var _ResponseCheck = require('../../../Bot/Helper/ResponseCheck');

var _ResponseCheck2 = _interopRequireDefault(_ResponseCheck);

var _Store = require('../../../Services/Store');

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
      _Store2.default.getStore("url_cache").then(url_cache => {
        if (url_cache[urlName] && options.force === false) {
          _ResponseCheck2.default.status(url_cache[urlName].url).then(url_status => {
            if (url_status !== 200) {
              this.getInfo().then(({ url, thumbnail }) => {
                url_cache[urlName] = {
                  url,
                  thumbnail
                };
                _Store2.default.setStore({ url_cache: url_cache }).then(() => {
                  resolve({ url, thumbnail });
                });
              }).catch(reject);
            } else {
              resolve(url_cache[urlName]);
            }
          });
        } else {
          url_cache = {};
          this.getInfo().then(({ url, thumbnail }) => {
            url_cache[urlName] = {
              url,
              thumbnail
            };
            _Store2.default.setStore({ url_cache: url_cache }).then(() => {
              resolve(url_cache[urlName]);
            });
          }).catch(reject);
        }
      });
    });
  }
}
exports.default = YoutubeDL;
//# sourceMappingURL=index.js.map