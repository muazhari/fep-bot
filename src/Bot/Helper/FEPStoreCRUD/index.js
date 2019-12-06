import { batch_list } from "../../../Bot";
import storage from "node-persist";
import Store from "../../../Services/Store";

const set_store = async data => {
  return new Promise(async (resolve, reject) => {
    if (!Object.keys(batch_list).includes(data.batch)) {
      return reject("Not in a proper batch");
    }

    let store = await Store.getStore("fep");
    if (store === undefined) {
      store = { [data.batch]: [] };
    }

    const selected_user_data = [data.name, data.campus, data.room];
    store[data.batch].push(selected_user_data);
    await Store.setStore({ fep: store });
    return resolve();
  });
};

const update_store = async data => {
  return new Promise(async (resolve, reject) => {
    if (!Object.keys(batch_list).includes(data.batch)) {
      return reject("Not in a proper batch");
    }

    const store = await Store.getStore("fep");
    const selectedUserData = [data.name, data.campus, data.room];
    store[data.batch][parseInt(data.num, 10) - 1] = selectedUserData;
    await Store.setStore({ fep: store });
    return resolve();
  });
};

const delete_store = async data => {
  const store = await Store.getStore("fep");

  if (store[data.batch].length > 0) {
    store[data.batch].splice(parseInt(data.num, 10) - 1, 1);
  }

  await Store.setStore({ fep: store });
};

export default {
  set_store,
  delete_store,
  update_store
};
