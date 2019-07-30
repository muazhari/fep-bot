"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FEPList = undefined;

var _internal = require("../../Bot/internal");

var _FEPStoreCRUD = require("../../Bot/Helper/FEPStoreCRUD");

var _FEPStoreCRUD2 = _interopRequireDefault(_FEPStoreCRUD);

var _Store = require("../../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FEPList = exports.FEPList = Bot => {
  const add = async args => {
    if (args.length === 4) {
      const data = {
        batch: args[0],
        name: args[1],
        campus: args[2],
        room: args[3]
      };
      await _FEPStoreCRUD2.default.set_store(data);

      Bot.Features.StoreAdvance.backup_store("silent");

      Bot.replyText(`Done!\n${data.name} - ${data.campus} - ${data.room}`);
    } else {
      Bot.replyText(`${_internal.command_prefix}add <batch> <name> <campus> <room>`);
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
      await _FEPStoreCRUD2.default.update_store(data);
      Bot.replyText("Done!");
      Bot.Features.StoreAdvance.backup_store("silent");
    } else {
      Bot.replyText(`${_internal.command_prefix}upd <batch> <number> <name> <campus> <room>`);
    }
  };

  const remove = async args => {
    if (args.length === 2) {
      const data = {
        batch: args[0],
        num: args[1]
      };
      await _FEPStoreCRUD2.default.delete_store(data);
      Bot.Features.StoreAdvance.backup_store("silent");
      Bot.replyText("Done!");
    } else {
      Bot.replyText(`${_internal.command_prefix}del <batch> <number>`);
    }
  };

  const view = async args => {
    if (args.length === 1) {
      const data = {
        batch: args[0] ? args[0] : undefined
      };

      const store = await _Store2.default.getStore("fep");

      if (store) {
        const selected_batch = args.length !== 1 ? Object.keys(store).sort() : [data.batch];

        if (selected_batch.every(item => Object.keys(store).includes(item))) {

          let msg = `FEP BINUSIAN IT\n(Nama - Kampus - Nomor Ruangan)\n\n`;

          selected_batch.forEach(batch => {
            console.log(batch);
            msg += `${batch.toUpperCase()}. ${_internal.batch_list[batch]}\n`;

            for (let i = 0; i < store[batch].length; i += 1) {
              msg += `  ${i + 1}. ${store[batch][i][0]} - ${store[batch][i][1]} - ${store[batch][i][2]}\n`;
            }
            msg += `\n`;

            console.log(msg.length);
          });
          Bot.replyText(msg);
        }
      }
    } else {
      Bot.replyText(`${_internal.command_prefix}view <batch>`);
    }
  };

  return {
    add,
    update,
    remove,
    view
  };
};
//# sourceMappingURL=FEPList.js.map