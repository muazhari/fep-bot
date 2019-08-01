import { shared_props } from "./internal";

export const HandlerDialogFlow = async Bot => {
  const { message } = Bot.props.event
  const { DialogFlow: DF } = Bot;
  const responses = await DF.chat(message.text);
  const { fulfillmentText, parameter } = responses;

  console.log(responses)
  Bot.replyText(fulfillmentText);
};
