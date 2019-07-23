import Bot from "../Bot";

export default class FEPList extends Bot.Commands {
  constructor(props) {
    super(props);
    this.event = this.props.event;
  }

  add = args => {
    if (args.length === 5) {
      const data = {
        batch: args[0],
        name: args[1],
        campus: args[2],
        room: args[3],
        user_id: this.event.source.userId
      };
      FepStoreCRUD.set_store(data);

      FepStoreCRUD.view([args[0], args[args.length - 1]]);

      Access.backup_store("silent");
    } else {
      this.sendMessage(`${command_prefix}add <batch> <name> <campus> <room>`);
    }
  };

  update = args => {
    if (args.length === 6) {
      const data = {
        batch: args[0],
        num: args[1],
        name: args[2],
        campus: args[3],
        room: args[4],
        user_id: this.event.source.userId
      };
      FepStoreCRUD.update_store(data);
      this.sendMessage("Done!");
      StoreBackup.backup_store("silent");
    } else {
      this.sendMessage(
        `${command_prefix}upd <batch> <number> <name> <campus> <room>`
      );
    }
  };

  remove = args => {
    if (args.length === 3) {
      const data = {
        batch: args[0],
        num: args[1],
        user_id: this.event.source.userId
      };
      FepStoreCRUD.delete_store(data);
      this.sendMessage("Done!");
      StoreBackup.backup_store("silent");
    } else {
      this.sendMessage(`${command_prefix}del <batch> <number>`);
    }
  };

  view = args => {
    if (args.length <= 2) {
      const data = {
        batch: args[0].toString().toLowerCase(),
        user_id: this.event.source.userId
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
            this.sendMessage(msg);
          });
        }
      }
    } else {
      this.sendMessage(`${command_prefix}view <batch>`);
    }
  };
}
