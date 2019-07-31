"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandlerDialogFlow = undefined;

var _internal = require("./internal");

const HandlerDialogFlow = exports.HandlerDialogFlow = async Bot => {
  const { message } = Bot.props.event;
  const { DialogFlow: DF } = Bot;
  const responses = await DF.chat(message.text);
  const { fulfillmentText, parameter } = responses;

  console.log(responses);
  Bot.replyText(fulfillmentText);
  console.log('handlerdf', _internal.shared_props);
};
//# sourceMappingURL=HandlerDialogFlow.js.map