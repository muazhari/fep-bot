"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _youtubeDl = require("youtube-dl");

var _youtubeDl2 = _interopRequireDefault(_youtubeDl);

var _ResponseCheck = require("../../Bot/Helper/ResponseCheck");

var _ResponseCheck2 = _interopRequireDefault(_ResponseCheck);

var _Store = require("../../Services/Store");

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
      _youtubeDl2.default.getInfo(this.url, options, async (err, info) => {
        if (err) {
          reject(err);
          throw err;
        };
        return resolve(info);
      });
    });
  }

  async generateUrl(urlName, options) {
    let url_cache = await _Store2.default.getStore('url_cache');

    if (url_cache[urlName] && options.force === false) {
      const url_status = await _ResponseCheck2.default.status(url_cache[urlName].url);

      if (url_status !== 200) {
        const { url, thumbnail } = await this.getInfo();
        url_cache['bifest'] = { url, thumbnail };
        await _Store2.default.setStore({ url_cache: url_cache });
        return { url, thumbnail };
      } else {
        return url_cache[urlName];
      }
    } else {
      url_cache = {};
      const { url, thumbnail } = await this.getInfo();
      url_cache['bifest'] = { url, thumbnail };
      await _Store2.default.setStore({ url_cache: url_cache });
      return { url, thumbnail };
    }
  }

}
exports.default = YoutubeDL;
//# sourceMappingURL=YoutubeDL.js.map