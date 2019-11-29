import { shared_props } from "../../Bot";

export const handlerDialogFlow = (Bot, response) => {
  const { message } = Bot.props.event;
  const df = Bot.dialogFlow;

  
  const { fulfillmentText, parameter } = response;

  Bot.replyText(fulfillmentText);
};
