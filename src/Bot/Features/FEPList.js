import { Bot } from "../../Bot/internal";
import FEPStoreCRUD from "../../Bot/Helper/FEPStoreCRUD";

import { getStore, setStore } from "../../Services/Store";

const batch_list = {
  a: "22 - 27 JULI 2019",
  b: "29 JULI - 3 AGUSTUS 2019",
  c: "5 - 10 AGUSTUS 2019",
  d: "19 - 24 AGUSTUS 2019",
  e: "26 - 03 SEPTEMBER 2019"
};

export const FEPList = Bot => {
  const add = args => {
    if (args.length === 5) {
      const data = {
        batch: args[0],
        name: args[1],
        campus: args[2],
        room: args[3],
        user_id: Bot.props.event.source.userId
      };
      FEPStoreCRUD.set_store(data);

      FEPStoreCRUD.view([args[0], args[args.length - 1]]);

      Bot.Command.Access.backup_store("silent");
    } else {
      Bot.sendMessage(
        `${Bot.command_prefix}add <batch> <name> <campus> <room>`
      );
    }
  };

  const update = args => {
    if (args.length === 6) {
      const data = {
        batch: args[0],
        num: args[1],
        name: args[2],
        campus: args[3],
        room: args[4],
        user_id: Bot.props.event.source.userId
      };
      FEPStoreCRUD.update_store(data);
      Bot.sendMessage("Done!");
      Bot.Command.StoreAdvance.backup_store.backup_store("silent");
    } else {
      Bot.sendMessage(
        `${Bot.command_prefix}upd <batch> <number> <name> <campus> <room>`
      );
    }
  };

  const remove = args => {
    if (args.length === 3) {
      const data = {
        batch: args[0],
        num: args[1],
        user_id: Bot.props.event.source.userId
      };
      FEPStoreCRUD.delete_store(data);
      Bot.sendMessage("Done!");
      Bot.Command.StoreAdvance.backup_store("silent");
    } else {
      Bot.sendMessage(`${Bot.command_prefix}del <batch> <number>`);
    }
  };

  const view = args => {
    if (args.length <= 2) {
      const data = {
        batch: args[0].toString().toLowerCase(),
        user_id: Bot.props.event.source.userId
      };
      const store = getStore("fep");
      if (store) {
        const selected_batch =
          args.length === 0 ? Object.keys(store).sort() : [data.batch];

        if (selected_batch.every(item => Object.keys(store).includes(item))) {
          const header = "FEP BINUSIAN IT\n(Nama - Kampus - Nomor Ruangan)\n\n";

          selected_batch.map(batch => {
            let msg = `${header} ${batch.upper()} ${batch_list[batch]}\n`;

            for (let i = 0; i < store.batch.length; i += 1) {
              msg += `${i + 1}. ${store.batch[i][0]} - ${store.batch[i][1]} - ${
                store.batch[i][2]
              }\n`;
            }

            msg += "\n";
            Bot.sendMessage(msg);
          });
        }
      }
    } else {
      Bot.sendMessage(`${Bot.command_prefix}view <batch>`);
    }
  };

  return {
    add,
    update,
    remove,
    view
  };
};
