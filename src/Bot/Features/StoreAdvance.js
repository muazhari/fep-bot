import { Bot } from "../../Bot/internal";
import { getStore, setStore } from "../../Services/Store";

export const StoreAdvance = Bot => {
  const reset_store = data => {
    const { storeName } = data;
    setStore({ [storeName]: {} });
    Bot.sendMessage("Done!");
  };

  const pre_store = args => {
    if (args.length <= 2) {
      const default_url =
        "https://gist.githubusercontent.com/muazhari/38a5819eb228a20a693db0516e76bedb/raw/5fe8b969ab5d3286f31026951edbb73ea030b460/feplist";
      const data = {
        url: args.length === 1 ? default_url : args[0],
        user_id: args[args.length - 1].source.userId
      };
      // const feplc = cleaner(data.url)
      // feplc.run()
      // const { store } = feplc
      // setStore({ fep: store })
      Bot.sendMessage("Done!");
    } else {
      Bot.sendMessage(`${Bot.command_prefix}pre_store <url>`);
    }
  };

  const backup_store = args => {
    const headers = {
      "Content-type": "application/json"
    };

    const store = getStore();
    const { backup } = store;

    if (backup.fep) {
      backup.fep = [];
    } else {
      backup.fep.slice(-20);
    }
    // const response = requests.post('https://paste.c-net.org/')
    // if (args === null || args !== 'silent') {
    //   Bot.sendMessage(`Done!\n${response.text}`)
    // }
    // backup.fep.push([[Date.now(), response]])

    setStore({ ...store, backup });
  };

  return {
    reset_store,
    pre_store,
    backup_store
  };
};
