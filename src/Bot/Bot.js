import { getStore, setStore } from "../Services/Store";
import * as line from "@line/bot-sdk";
import { FEPList, StoreAdvance, Basic, Access } from "./internal";

import config from "../Config/Line";

export class Bot {
  // create LINE SDK client
  constructor(props) {
    this.props = props
    this.client = new line.Client(config);
    
    // Command creator
    this.Command = {
      FEPList: FEPList(this), 
      StoreAdvance: StoreAdvance(this), 
      Basic: Basic(this),
      Access: Access(this)
    }
  }
  
  sendMessage(msg) {
    console.log(msg)
      const echo = {
        type: "text",
        text: msg
      };
        return this.client.replyMessage(this.props.event.replyToken, echo);
    };
}






