import youtubedl from "youtube-dl";
import ResponseCheck from "../../../Bot/Helper/ResponseCheck";
import Store from "../../../Services/Store";

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
      Store.getStore("urlCache").then(urlCache => {
        if (urlCache && urlCache[urlName] && options.force === false) {
          ResponseCheck.status(urlCache[urlName].url).then(urlStatus => {
            if (urlStatus !== 200) {
              this.getInfo().then(({url, thumbnail}) => {
                urlCache[urlName] = {
                  url,
                  thumbnail
                };
                Store.setStore({urlCache: urlCache}).then(() => {
                  resolve({url, thumbnail});
                });
              }).catch(reject);
            } else {
              resolve(urlCache[urlName]);
            }
          });
        } else {
          urlCache = {};
          this.getInfo().then(({url, thumbnail}) => {
            urlCache[urlName] = {
              url,
              thumbnail
            };
            Store.setStore({urlCache: urlCache}).then(() => {
              resolve(urlCache[urlName]);
            });
          }).catch(reject);
        }
      });
    });
  }
}
