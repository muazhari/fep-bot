import youtubedl from "youtube-dl";
import ResponseCheck from "../../Bot/Helper/ResponseCheck";
import Store from "../../Services/Store";

export default class YoutubeDL {
  constructor(url) {
    this.url = url;
    this.getInfo = this.getInfo.bind(this)
    this.generateUrl = this.generateUrl.bind(this)
  }

  getInfo(res) {
    const resolution = res || 480;
    // const options = [`-f 'bestvideo[height<=${resolution}]+bestaudio/best[height<=${resolution}]'`]
    const options = [];

    return new Promise((resolve, reject) => {
      youtubedl.getInfo(this.url, options, async (err, info) => {
        if (err) {
          reject(err)
          throw err
        };
        return resolve(info);
      });
    });
  }
  
  async generateUrl(urlName, options) {
    let url_cache = await Store.getStore('url_cache')
    
    if (url_cache[urlName] && options.force === false) {
        const url_status = await ResponseCheck.status(url_cache[urlName].url)

        if (url_status !== 200 ) {
          const { url, thumbnail } = await this.getInfo()
          url_cache['bifest'] = { url, thumbnail }
          await Store.setStore({ url_cache: url_cache })
          return { url, thumbnail }
        } else {
          return url_cache[urlName]
        }
      
    } else {
          url_cache = {}
          const { url, thumbnail } = await this.getInfo()
          url_cache['bifest'] = { url, thumbnail }
          await Store.setStore({ url_cache: url_cache })
          return { url, thumbnail }
      }
  }
  
}
