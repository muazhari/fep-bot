import { command_prefix, batch_list } from "../../Bot";
import FEPCleaner from "../../Bot/Helper/FEPCleaner";
import Store from "../../Services/Store";
import storage from "node-persist";
import autoBind from "auto-bind";


import axios from "axios";


// const default_url = "https://gist.githubusercontent.com/muazhari/38a5819eb228a20a693db0516e76bedb/raw/7716b10d92b526be02d94750c5cfc347ad7ed47d/feplist"


export const StoreAdvance = Bot  => {
  const reset_store = async args => {
    if (args.length === 1) {
      await Store.setStore({ [args[0]]: {} });
      Bot.replyText("Done!");
    }
  };

  const pre_store = async args => {
    if (args.length === 1) {
      const data = {
        url: args[0]
      };

//       const response = await axios({
//         method: "get",
//         url: data.url,
//         // responseType: "text"
//       });

//       console.log(typeof response.data);

      const response = await FEPCleaner.run(data.url)
      const parsed = JSON.parse(response)
      console.log(parsed)


      await Store.setStore({ fep: parsed });
      Bot.replyText("Done!");
    } else {
      Bot.replyText(`${command_prefix}pre_store <url>`);
    }
  };

  const backup_store = async args => {
    const headers = {
      "Content-type": "application/json"
    };

    const fep = await Store.getStore("fep");
    const backup = await Store.getStore("backup_fep");

    if (backup) {
      backup.splice(-20);
    } else {
      const backup = [];
    }
    // const response = requests.post('https://paste.c-net.org/')

    const timeStamp = Date.now();

    backup.push([{ timeStamp: timeStamp, content: fep }]);

    await Store.setStore({ backup_fep: backup });

    if (args !== "silent") {
      Bot.replyText(`Done!\n${Date.now()}`);
    }
  };

  return {
    reset_store,
    pre_store,
    backup_store
  };
};
