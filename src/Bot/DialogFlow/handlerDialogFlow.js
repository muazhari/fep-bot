import { shared_props } from "../../Bot";

export class handlerDialogFlow {
  constructor(Bot, response){
    this.Bot = Bot;
    this.response = response;
    this.handleIntent(response);
  }
  const { message } = Bot.props.event;
  const df = Bot.dialogFlow;

  
  const { fulfillmentText, parameter } = response;

  Bot.replyText(fulfillmentText);
};
