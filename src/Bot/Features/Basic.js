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
      `add <batch> <name> <campus> <room> - .add a kamu Kemanggisan 000
upd <batch> <number> <name> <campus> <room> - .upd a 1 kamu Kemanggisan 000
del <batch> <number> - .del a 1
view <batch> - .view a / .view`;
    
    Bot.sendMessage(msg);
  };

  return {
    admin,
    help
  };
};
