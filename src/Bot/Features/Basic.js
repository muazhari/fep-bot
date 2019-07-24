import { Bot, Access, StoreAdvance } from "../../Bot/internal";

export const Basic = Bot => {
  const admin = args => {
    const { source } = Bot.props.event;
    if (Access.whitelist_check(source.userId)) {
      Bot.sendMessage("privilage: {}".format(Bot.props.event));
    }
  };

  const help = () => {
    const msg =
      "add <batch> <name> <campus> <room> - .add a kamu Kemanggisan 000\n    upd <batch> <number> <name> <campus> <room> - .upd a 1 kamu Kemanggisan 000\ndel <batch> <number> - .del a 1\nview <batch> - .view a / .view\n    ";
    Bot.sendMessage(msg);
  };

  return {
    admin,
    help
  };
};
