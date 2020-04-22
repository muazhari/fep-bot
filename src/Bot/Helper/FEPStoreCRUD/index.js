import storage from "node-persist";
import { BATCH_LIST } from "../../../Bot";
import Store from "../../../Services/Store";

const set_store = async (data) => {
  return new Promise(async (resolve, reject) => {
    if (!Object.keys(BATCH_LIST).includes(data.batch)) {
      return reject("Not in a proper batch");
    }

    let store = await Store.getStore("fep");
    if (store === undefined) {
      store = { [data.batch]: [] };
    }
    if (!Object.keys(store).includes(data.batch)) {
      store[data.batch] = [];
    }

    const selectedUserData = [data.name, data.campus, data.room];
    store[data.batch].push(selectedUserData);
    await Store.setStore({ fep: store });
    return resolve();
  });
};

const update_store = async (data) => {
  return new Promise(async (resolve, reject) => {
    if (!Object.keys(BATCH_LIST).includes(data.batch)) {
      return reject("Not in a proper batch");
    }

    const store = await Store.getStore("fep");
    const selectedUserData = [data.name, data.campus, data.room];
    store[data.batch][parseInt(data.num, 10) - 1] = selectedUserData;
    await Store.setStore({ fep: store });
    return resolve();
  });
};

const delete_store = async (data) => {
  return new Promise(async (resolve, reject) => {
    if (!Object.keys(BATCH_LIST).includes(data.batch)) {
      return reject("Not in a proper batch");
    }

    const store = await Store.getStore("fep");
    if (store[data.batch].length > 0) {
      store[data.batch].splice(parseInt(data.num, 10) - 1, 1);
    }

    await Store.setStore({ fep: store });
    return resolve();
  });
};

export default {
  set_store,
  delete_store,
  update_store,
};
