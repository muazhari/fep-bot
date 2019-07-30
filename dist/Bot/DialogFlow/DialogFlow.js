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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DialogFlow = exports.DialogFlow = Bot => {
  const { message } = Bot.props.event;
  const projectId = "newagent-nlaqvy";
  // A unique identifier for the given session
  const sessionId = _uuid2.default.v4();

  // Create a new session
  const sessionClient = new _dialogflow2.default.SessionsClient(_DialogFlow2.default);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const phrases = {
    talk: ['feppi', 'mulai bicara'],
    silent: ['feppi selesai', 'berhenti bicara']
  };

  let intent_status = false;

  // Send request and log result
  const talk = async msg => {
    if (phrases.talk.includes(msg.toLowerCase())) intent_status = true;
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
    const responses = await sessionClient.detectIntent(query);
    const { fulfillmentText } = responses[0].queryResult;
    console.log("Detected intent", fulfillmentText);

    if (intent_status && fulfillmentText.length >= 1) {
      await Bot.replyText(fulfillmentText);
    }
    if (phrases.silent.includes(msg.toLowerCase())) intent_status = false;
  };

  return {
    talk
  };
};
//# sourceMappingURL=DialogFlow.js.map