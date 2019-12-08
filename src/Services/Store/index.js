import storage from "node-persist";
import path from "path";

// share worker props by groupId
// const shared_props = storage.create({});

const init = async () => {
  await storage.init({
    dir: path.join(__dirname, "../../../src/Logs"),
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
    logging: true, // can also be custom logging function
    ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
    expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
    // in some cases, you (or some other service) might add non-valid storage files to your
    // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
    forgiveParseErrors: false
  });
};

const setStore = async obj => {
  Object.keys(obj).map(async key => {
    await storage.setItem(key, obj[key]);
  });
};

const getStore = async storeName => {
  return await storage.getItem(storeName);
};

const remStore = async storeName => {
  await storage.removeItem(storeName);
};

const updStore = async (storeName, value) => {
  await storage.updateItem(storeName, value);
};

export default {init, setStore, getStore, remStore, updStore};
