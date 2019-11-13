"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlerDialogFlow = undefined;

var _internal = require("./internal");

const handlerDialogFlow = exports.handlerDialogFlow = Bot => {
  const { message } = Bot.props.event;
  const { DialogFlow: DF } = Bot;

  DF.chat().then(responses => {
    const { fulfillmentText, parameter } = responses;

    console.log(responses);
    Bot.replyText(fulfillmentText);
  }).catch(err => {
    console.log("DialogFlow ERR", err);
  });
};
//# sourceMappingURL=handlerDialogFlow.js.map