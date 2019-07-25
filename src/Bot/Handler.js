import { Bot } from "./internal";

export const batch_list = {
  a: "22 - 27 JULI 2019",
  b: "29 JULI - 3 AGUSTUS 2019",
  c: "5 - 10 AGUSTUS 2019",
  d: "19 - 24 AGUSTUS 2019",
  e: "26 - 03 SEPTEMBER 2019"
};

export const command_prefix = "/";

const messageToCommandValidate = chat => {
  const content_command = chat[0].slice(1, chat[0].length);
  const content_args = chat.slice(1, chat.length).map(item => item.trim());

  console.log(content_command, content_args);

  return { content_command, content_args };
};

const handleCommand = (commandList, chat) => {

  const content_prefix = chat[0][0];
  if (content_prefix === command_prefix) {
    const { content_command, content_args } = messageToCommandValidate(chat);
    if (Object.keys(commandList).includes(content_command)) {
      if (
        commandList[content_command] &&
        commandList[content_command].length > 0
      ) {
        commandList[content_command](content_args);
      } else {
        commandList[content_command]();
      }
    }
  }
};

export const Handler = async event => {
  console.log(event);
  const Worker = new Bot({ event });  
  // Worker.Command.StoreAdvance.pre_store([])
  

  if (event.type === 'message') {
    const profile = await Worker.client.getProfile(event.source.userId) 

    const { FEPList, StoreAdvance, Basic } = Worker.Command

    const commandList = {
      add: FEPList.add,
      upd: FEPList.update,
      rem: FEPList.remove,
      view: FEPList.view,
      rstore: StoreAdvance.reset_store,
      pstore: StoreAdvance.pre_store,
      bstore: StoreAdvance.backup_store,
      "]]": Basic.admin,
      help: Basic.help
    };
  
      const chat_splitted = event.message.text.split(" ");
      handleCommand(commandList, chat_splitted);
  }
  
  if (event.type === 'memberJoined') { 
    const profile = await Worker.client.getProfile(event.joined.members[0].userId)
    Worker.sendMessage(`Welcome ${profile.displayName}! Jangan lupa cek notes di group ya!`) 
  }
};