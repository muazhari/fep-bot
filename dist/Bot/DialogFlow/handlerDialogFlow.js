"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlerDialogFlow = undefined;

var _Bot = require("../../Bot");

const handlerDialogFlow = exports.handlerDialogFlow = Bot => {
  const { message } = Bot.props.event;
  const df = Bot.DialogFlow;

  df.chat().then(responses => {
    const { fulfillmentText, parameter } = responses;

    Bot.replyText(fulfillmentText);
  }).catch(err => {
    console.log("DialogFlow ERR", err);
  });
};
//# sourceMappingURL=handlerDialogFlow.js.map