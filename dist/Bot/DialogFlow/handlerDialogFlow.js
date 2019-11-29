"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlerDialogFlow = undefined;

var _Bot = require("../../Bot");

const handlerDialogFlow = exports.handlerDialogFlow = (Bot, response) => {
  const { message } = Bot.props.event;
  const df = Bot.dialogFlow;

  const { fulfillmentText, parameter } = response;

  Bot.replyText(fulfillmentText);
};
//# sourceMappingURL=handlerDialogFlow.js.map