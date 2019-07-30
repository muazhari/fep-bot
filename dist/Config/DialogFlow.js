"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const config = {
  credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace(new RegExp("\\\\n", "\g"), "\n"),
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

exports.default = config;
//# sourceMappingURL=DialogFlow.js.map