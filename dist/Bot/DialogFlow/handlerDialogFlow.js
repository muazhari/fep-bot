"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlerDialogFlow = undefined;

var _Bot = require("../../Bot");

class handlerDialogFlow {
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
exports.handlerDialogFlow = handlerDialogFlow;
//# sourceMappingURL=handlerDialogFlow.js.map