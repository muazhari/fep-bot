import storage from "node-persist";

// const fepStore = storage.create({});

const init = async () => {
  await storage.init()
}

const setStore = async obj => {
 Object.keys(obj).map(async key => {
    await storage.setItem(key, obj[key])
  })
}

const getStore = async storeName => {
  return await storage.getItem(storeName)
}

const remStore = async storeName => {
  await storage.removeItem(storeName)
}

const updStore = async (storeName, value) => {
  await storage.updateItem(storeName, value)
}

export default {
  init,
  setStore,
  getStore,
  remStore,
  updStore,
}
