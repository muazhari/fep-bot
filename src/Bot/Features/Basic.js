import { Bot, StoreAdvance, command_prefix } from "../../Bot/internal";

export const Basic = Bot => {
  const admin = args => {
    const { source } = Bot.props.event;
    if (Bot.Features.Access.whitelist_check(source.userId)) {
      Bot.replyText("privilage: {}".format(Bot.props.event));
    }
  };
  
  const say = args => {
    if (args.length >= 1) {
      const { source } = Bot.props.event;
      const msg = [...args].join(' ')
        Bot.replyText(msg);
    } else {
      Bot.replyText(`${command_prefix}say <msg>`);
    }
  };
  

  const greet = args => {
    const groupId = args[0] || Bot.props.event.source.groupId;
    console.log(groupId)
    Bot.client.getGroupMemberIds(groupId).then(ids => {
      ids.forEach((id) => console.log(id))
      console.log(ids, ids)
      Bot.client.getGroupMemberProfile(groupId, ids[0]).then(profile => {
          Bot.replyText(`Welcome ${profile.displayName}! Jangan lupa cek notes di group ya!`);
      });
    }).catch(err => {
        throw err;
      });
  };

  const profile = arg => {
    const { source } = Bot.props.event;

    if (arg || source.userId) {
      const userId = arg[0] || source.userId;
      console.log(userId);
      Bot.client
        .getProfile(userId)
        .then(profile =>
          Bot.replyText([
            `Display name: ${profile.displayName}`,
            `Status message: ${profile.statusMessage}`
          ])
        );
    } else {
      Bot.replyText("Bot can't use profile API without user ID");
    }
  };

  const help = () => {
    const msg = `FEP Days & Rooms Commands
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
    profile,
    greet,
    say,
  };
};
