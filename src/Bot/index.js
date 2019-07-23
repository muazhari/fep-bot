import { getStore, setStore } from "./Services/Store";
import * as line from "@line/bot-sdk";
import config from "./Config/Line";

// create LINE SDK client
const client = new line.Client(config);

const batch_list = {
  a: "22 - 27 JULI 2019",
  b: "29 JULI - 3 AGUSTUS 2019",
  c: "5 - 10 AGUSTUS 2019",
  d: "19 - 24 AGUSTUS 2019",
  e: "26 - 03 SEPTEMBER 2019"
};

const command_prefix = ".";

// main channel
export const handleEvent = async event => {
  console.log(event);

  handleCommand({ event });
};

const handleCommand = props => {
  const { event } = props;
  const x = new Commands(props);

  const connectProps = {
    fepl: new FEPlist(),
    storeAdv: new StoreAdvance(),
    basic: new Basic()
  };

  const { fepl, storeAdv, basic } = connectProps;

  const commandList = {
    add: fepl.add,
    upd: fepl.update,
    rem: fepl.remove,
    view: fepl.view,
    rstore: storeAdv.reset_store,
    pstore: storeAdv.pre_store,
    bstore: storeAdv.backup_store,
    "]]": basic.admin,
    help: basic.help
  };

  const content_splitted = event.message.text.split(" ");
  const content_prefix = content_splitted[0][0];
  const content_command = content_splitted[0].slice(
    1,
    content_splitted[0].length
  );
  const content_args = content_splitted
    .slice(1, content_splitted.length)
    .map(item => item.trim());
  // content_args.push(event)

  console.log(content_splitted, content_prefix, content_command, content_args);
  console.log(commandList[content_command]);

  if (
    content_prefix === command_prefix &&
    Object.keys(commandList).includes(content_command)
  ) {
    if (commandList[content_command].length > 0) {
      commandList[content_command](content_args);
    } else {
      commandList[content_command]();
    }
  }
};

class Commands {
  constructor(props) {
    this.props = props;
  }

  sendMessage = msg => {
    const echo = {
      type: "text",
      text: msg
    };
    return client.replyMessage(this.props.event.replyToken, echo);
  };
}
