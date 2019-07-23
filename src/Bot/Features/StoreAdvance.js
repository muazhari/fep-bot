import Bot from "../Bot";
import FepStoreCRUD from "../FepStoreCRUD";

export default class StoreAdvance extends Bot.Commands {
  constructor(props) {
    super(props);
    this.event = this.props.event;
  }

  reset_store = data => {
    const { storeName } = data;
    setStore({ [storeName]: {} });
    this.sendMessage("Done!");
  };

  pre_store = args => {
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
      this.sendMessage("Done!");
    } else {
      this.sendMessage(`${command_prefix}pre_store <url>`);
    }
  };
}
