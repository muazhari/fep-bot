import { batch_list } from "../../Bot/internal";
import storage from "node-persist";
import { getStore, setStore } from "../../internal";


const set_store = data => {
    if (Object.keys(batch_list).includes(data.batch)) {
      const store = getStore("fep");
      if (Object.keys(store).includes(data.batch)) {
        store[data.batch] = [];
      }
      const selected_user_data = [data.name, data.campus, data.room];
      store[data.batch].push(selected_user_data);

      setStore({ fep: store });
    }
};

const update_store = data => {
    if (Object.keys(batch_list).includes(data.batch)) {
      const store = getStore("fep");
      try {
        const selected_user_data = [data.name, data.campus, data.room];
        store[data.batch][parseInt(data.num, 10) - 1] = selected_user_data;
        setStore({ fep: store });
      } catch (err) {
        this.set_store(data);
      }
    }
};

const delete_store = data => {
    const store = getStore("fep");

    if (store[data.batch].length > 0) {
      store[data.batch].splice(parseInt(data.num, 10) - 1, 1);
    }
    setStore({ fep: store });
};
  
export default {
  set_store,
  delete_store,
  update_store  
} 
