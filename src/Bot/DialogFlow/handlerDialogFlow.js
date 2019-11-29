import { shared_props } from "../../Bot";

export const handlerDialogFlow = (Bot, response) => {
  const { message } = Bot.props.event;
  const df = Bot.DialogFlow;

  df.chat()
    .then(responses => {
      const { fulfillmentText, parameter } = responses;

      Bot.replyText(fulfillmentText);
    })
    .catch(err => {
      console.log("DialogFlow ERR", err);
    });
};
