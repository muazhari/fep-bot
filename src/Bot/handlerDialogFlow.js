import {shared_props} from "./internal";

export const handlerDialogFlow = Bot => {
  const {message} = Bot.props.event;
  const {DialogFlow: DF} = Bot;

  DF.chat().then(responses => {
    const {fulfillmentText, parameter} = responses;

    console.log(responses);
    Bot.replyText(fulfillmentText);
  }).catch(err => {
    console.log("DialogFlow ERR", err);
  });
};
