import { command_prefix, batch_list } from "../../Bot";
import FEPStoreCRUD from "../../Bot/Helper/FEPStoreCRUD";

import Store from "../../Services/Store";

export const FEPList = Bot => {
  const add = async args => {
    if (args.length === 4) {
      const data = {
        batch: args[0],
        name: args[1],
        campus: args[2],
        room: args[3]
      };

      FEPStoreCRUD.set_store(data)
        .then(() => {
          Bot.Features.StoreAdvance.backup_store("silent");
          Bot.replyText(`Done!\n${data.name} - ${data.campus} - ${data.room}`);
        })
        .catch(err => {
          Bot.replyText(`${err}`);
        });
    } else {
      Bot.replyText(`${command_prefix}add <batch> <name> <campus> <room>`);
    }
  };

  const update = async args => {
    if (args.length === 5) {
      const data = {
        batch: args[0],
        num: args[1],
        name: args[2],
        campus: args[3],
        room: args[4]
      };
      FEPStoreCRUD.update_store(data)
        .then(() => {
          Bot.Features.StoreAdvance.backup_store("silent");
          Bot.replyText(
            `Done update!\n${data.name} - ${data.campus} - ${data.room}`
          );
        })
        .catch(err => {
          Bot.replyText(`${err}`);
        });
    } else {
      Bot.replyText(
        `${command_prefix}upd <batch> <number> <name> <campus> <room>`
      );
    }
  };

  const remove = async args => {
    if (args.length === 2) {
      const data = {
        batch: args[0],
        num: args[1]
      };
      FEPStoreCRUD.delete_store(data)
        .then(() => {
          Bot.Features.StoreAdvance.backup_store("silent");
          Bot.replyText(
            `Done remove!\n${data.name} - ${data.campus} - ${data.room}`
          );
        })
        .catch(err => {
          Bot.replyText(`${err}`);
        });
    } else {
      Bot.replyText(`${command_prefix}del <batch> <number>`);
    }
  };

  const view = async args => {
    if (args.length === 1) {
      const data = {
        batch: args[0]
      };

      const store = await Store.getStore("fep");

      if (store) {
        const selected_batch =
          data.batch === "all" ? Object.keys(store).sort() : [data.batch];

        if (selected_batch.every(item => Object.keys(store).includes(item))) {
          let msg = `FEP BINUSIAN IT\n(Nama - Kampus - Nomor Ruangan)\n\n`;

          selected_batch.forEach(batch => {
            msg += `${batch.toUpperCase()}. ${batch_list[batch]}\n`;

            for (let i = 0; i < store[batch].length; i += 1) {
              msg += `  ${i + 1}. ${store[batch][i][0]} - ${
                store[batch][i][1]
              } - ${store[batch][i][2]}\n`;
            }
            msg += `\n`;
          });
          Bot.replyText(msg);
        }
      }
    } else {
      Bot.replyText(`${command_prefix}view <batch || all>`);
    }
  };

  return {
    add,
    update,
    remove,
    view
  };
};
