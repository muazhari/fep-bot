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

  const talk_check = responses => {
    const { fields } = responses[0].queryResult.parameters;
    const { displayName } = responses[0].queryResult.intent;
    if (displayName === "Feppi - talk" || displayName === "Feppi - silent") {
      if (Object.keys(fields).includes("talk")) {
        _internal.shared_props[Bot.getId().default]["status"] = fields.talk.stringValue === "true";
      }
    }
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

  // Send request and log result
  const talk = async msg => {
    const query = get_query(msg);
    const responses = await sessionClient.detectIntent(query);
    const { fulfillmentText } = responses[0].queryResult;

    const status = _internal.shared_props[Bot.getId().default].status ? _internal.shared_props[Bot.getId().default].status : true;

    if (status && fulfillmentText.length >= 1) {
      Bot.replyText(fulfillmentText);
    }

    talk_check(responses);
    console.log(_internal.shared_props);
    console.log(_internal.shared_props[Bot.getId().default].status, status);
    console.log("Detected intent", responses[0].queryResult.intent.displayName);
  };

  return {
    talk
  };
};
//# sourceMappingURL=DialogFlow.js.map