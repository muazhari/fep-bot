import youtubedl from "youtube-dl";
import ResponseCheck from '../../../Bot/Helper/ResponseCheck'
import Store from '../../../Services/Store'

export default class YoutubeDL {
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
      youtubedl.getInfo(this.url, options, (err, info) => {
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
      Store.getStore("url_cache").then(url_cache => {
        if (url_cache[urlName] && options.force === false) {
          ResponseCheck.status(url_cache[urlName].url).then(url_status => {
            if (url_status !== 200) {
              this.getInfo().then(({url, thumbnail}) => {
                url_cache[urlName] = {
                  url,
                  thumbnail
                };
                Store.setStore({url_cache: url_cache}).then(() => {
                  resolve({url, thumbnail});
                });
              }).catch(reject);
            } else {
              resolve(url_cache[urlName]);
            }
          });
        } else {
          url_cache = {};
          this.getInfo().then(({url, thumbnail}) => {
            url_cache[urlName] = {
              url,
              thumbnail
            };
            Store.setStore({url_cache: url_cache}).then(() => {
              resolve(url_cache[urlName]);
            });
          }).catch(reject);
        }
      });
    });
  }
}
