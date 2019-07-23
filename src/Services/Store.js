const store = {}

const setStore = obj => {
  Object.keys(obj).map(key => {
    store[key] = obj[key]
  })
}

const getStore = storeName => {
  return store[storeName]
}

const delStore = storeName => {
  delete store[storeName]
}

export default {
  setStore,
  getStore,
  delStore,
}
