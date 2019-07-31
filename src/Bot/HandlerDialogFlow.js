export const HandlerDialogFlow = Bot => {
  const WorkerDF = new Bot.DialogFlow();
  const responses = WorkerDF.chat(message.text);
  const { fulfillmentText, parameter } = responses;

  this.Bot.replyText(fulfillmentText);
};
