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

var _DialogFlow2 = _interopRequireDefault(_DialogFlow);

var _internal = require("../../Bot/internal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DialogFlow = exports.DialogFlow = Bot => {
  const { message, source } = Bot.props.event;
  const projectId = "newagent-nlaqvy";
  // A unique identifier for the given session
  const sessionId = _uuid2.default.v4();

  // Create a new session
  const sessionClient = new _dialogflow2.default.SessionsClient(_DialogFlow2.default);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const get_parameter = responses => {
    const { fields } = responses[0].queryResult.parameters;
    const { displayName } = responses[0].queryResult.intent;
    const { allRequiredParamsPresent } = responses[0].queryResult;
    return { displayName, fields, allRequiredParamsPresent };
  };

  const get_query = msg => {
    const query = {
      session: sessionPath,
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
  };

  const talk_check = parameter => {
    const { fields, displayName } = parameter;
    if (displayName === "chat.talk" || displayName === "chat.silent") {
      if (Object.keys(fields).includes("chat")) {
        _internal.shared_props[Bot.getId().default]["status"] = fields.chat.stringValue === "true";
      }
    }
  };

  // Send request and log result
  const talk = async msg => {
    const query = get_query(msg);
    const responses = await sessionClient.detectIntent(query);
    const parameter = get_parameter(responses);
    const { queryResult } = responses[0];
    const { fulfillmentText } = queryResult;

    const status = _internal.shared_props[Bot.getId().default].status === undefined ? false : _internal.shared_props[Bot.getId().default].status;

    if (status && fulfillmentText.length >= 1) {
      Bot.replyText(fulfillmentText);
    }

    talk_check(parameter);

    // console.log(responses[0].queryResult)
    console.log("parameter", parameter);
    console.log("shared_props", _internal.shared_props[Bot.getId().default].status, status);
    console.log("Detected intent", responses[0].queryResult.displayName);
  };

  return {
    talk
  };
};
//# sourceMappingURL=DialogFlow.js.map