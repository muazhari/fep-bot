import { shared_props } from "../../Bot";

export class handlerDialogFlow {
  constructor(Bot, response) {
    this.Bot = Bot;
    this.response = response;
    this.handleIntent(response.parameter.displayName);
  }

  handleIntent(intent) {
    const { fulfillmentText, parameter } = this.response;
    const { message } = this.Bot.props.event;
    switch (intent) {
      default:
        this.Bot.replyText(fulfillmentText);
    }
  }
}
