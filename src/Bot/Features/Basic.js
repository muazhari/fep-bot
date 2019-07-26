import { Bot, StoreAdvance, command_prefix } from "../../Bot/internal";

export const Basic = Bot => {
  const admin = args => {
    const { source } = Bot.props.event;
    if (Bot.Command.Access.whitelist_check(source.userId)) {
      Bot.replyText("privilage: {}".format(Bot.props.event));
    }
  };
  
  const profile = () => {
    const { source } = Bot.props.event
    
    if (source.userId) {
        return Bot.client.getProfile(source.userId)
          .then((profile) => Bot.replyText(
            [
              `Display name: ${profile.displayName}`,
              `Status message: ${profile.statusMessage}`,
            ]
          ));
      } else {
        return Bot.replyText('Bot can\'t use profile API without user ID');
      }
  }

  const help = () => {
    const msg =
      `FEP Days & Rooms Commands
1. add <batch> <name> <campus> <room>
    ${command_prefix}add a kamu Kemanggisan 000

2. upd <batch> <number> <name> <campus> <room>
    ${command_prefix}upd a 1 kamu Kemanggisan 000

3. del <batch> <number>
    ${command_prefix}del a 1

4. view <batch>
    ${command_prefix}view a`;
    
    Bot.replyText(msg);
  };

  return {
    admin,
    help,
    profile
  };
};
