"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const default_agent = {
  projectId: process.env.DIALOGFLOW_PROJECT_ID,
  config: {
    credentials: {
      private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace(new RegExp("\\\\n", "g"), "\n"),
      client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
  }
};

exports.default_agent = default_agent;
//# sourceMappingURL=DialogFlow.js.map