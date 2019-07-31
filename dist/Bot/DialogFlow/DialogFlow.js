"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogFlow = undefined;

var _dialogflow = require("dialogflow");

var _dialogflow2 = _interopRequireDefault(_dialogflow);

var _uuid = require("uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _DialogFlow = require("../../Config/DialogFlow");

var _Bot = require("../../Bot");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DialogFlow {
  constructor(Bot) {
    this.Bot = Bot;
    this.get_parameter = this.get_parameter.bind(this);
    this.get_query = this.get_query.bind(this);
    this.chat_switch = this.chat_switch.bind(this);
    this.chat = this.chat.bind(this);

    // selected agent
    this.agent = _DialogFlow.default_agent;
    this.projectId = this.agent.projectId;
    this.config = this.agent.config;

    // A unique identifier for the given session
    this.sessionId = _uuid2.default.v4();

    // Create a new session
    this.sessionClient = new _dialogflow2.default.SessionsClient(this.config);
    this.sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);

    this.temp_chat_switch = true;
  }
  get_parameter(responses) {
    const { fields } = responses[0].queryResult.parameters;
    const { displayName } = responses[0].queryResult.intent;
    const { allRequiredParamsPresent } = responses[0].queryResult;
    return { displayName, fields, allRequiredParamsPresent };
  }

  get_query(msg) {
    const query = {
      session: this.sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: msg,
          // The language used by the client (en-US/id)
          languageCode: "id"
        }
      }
    };
    return query;
  }

  chat_switch(parameter, chat_switch_callback, default_callback) {
    const props_id = this.Bot.getId().default;
    const { fields, displayName } = parameter;
    if (displayName === "chat.talk" || displayName === "chat.silent") {
      if (Object.keys(fields).includes("chat")) {
        _Bot.shared_props[props_id]["status"] = fields.chat.stringValue === "true";
        return chat_switch_callback();
      }
    }
    return default_callback();
  }

  // Send request and log result
  async chat(msg) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = this.get_query(msg);
        const responses = await this.sessionClient.detectIntent(query);
        const parameter = this.get_parameter(responses);

        const { queryResult } = responses[0];
        const { fulfillmentText } = queryResult;

        const status = _Bot.shared_props[this.Bot.getId().default].status === undefined ? false : _Bot.shared_props[this.Bot.getId().default].status;

        const chat_switch_callback = () => {
          return resolve({ fulfillmentText, parameter });
        };

        const default_callback = () => {
          if (status) {
            return resolve({ fulfillmentText, parameter });
          }
        };

        if (fulfillmentText.length >= 1) {
          this.chat_switch(parameter, chat_switch_callback, default_callback);
        }

        console.log("parameter", parameter);
        console.log("shared_props", _Bot.shared_props[this.Bot.getId().default].status, status);
        console.log("Detected intent", responses[0].queryResult.displayName);
      } catch (err) {
        reject(err);
      }
    });
  }
}
exports.DialogFlow = DialogFlow;
//# sourceMappingURL=DialogFlow.js.map