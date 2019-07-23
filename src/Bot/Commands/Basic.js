import Bot from "../Bot";

export default class Basic extends Bot.Commands {
  constructor(props) {
    super(props);
    this.event = this.props.event;
  }

  admin = args => {
    const { source } = this.event;
    if (Access.whitelist_check(source.userId)) {
      this.sendMessage("privilage: {}".format(this.event));
    }
  };

  help = () => {
    const msg =
      "\n    add <batch> <name> <campus> <room> - .add a kamu Kemanggisan 000\n    upd <batch> <number> <name> <campus> <room> - .upd a 1 kamu Kemanggisan 000\n    del <batch> <number> - .del a 1\n    view <batch> - .view a / .view\n    ";
    this.sendMessage(msg);
  };
}
