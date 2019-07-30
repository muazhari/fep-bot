"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dialogflow = require("dialogflow");

var _dialogflow2 = _interopRequireDefault(_dialogflow);

var _uuid = require("uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _DialogFlow = require("../../Config/DialogFlow");

var _DialogFlow2 = _interopRequireDefault(_DialogFlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DialogFlow = async Bot => {
  const projectId = "newagent-nlaqvy";
  // A unique identifier for the given session
  const sessionId = _uuid2.default.v4();

  // Create a new session
  const sessionClient = await new _dialogflow2.default.SessionsClient(_DialogFlow2.default);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // Send request and log result
  const request = message => {
    console.log(_DialogFlow2.default, message);
    return new Promise((resolve, reject) => {
      try {
        const query = {
          session: sessionPath,
          queryInput: {
            text: {
              // The query to send to the dialogflow agent
              text: message,
              // The language used by the client (en-US)
              languageCode: "en-US"
            }
          }
        };
        const responses = sessionClient.detectIntent(query);
        console.log("Detected intent", responses);
        const result = responses[0].queryResult;
        resolve(result);
      } catch (err) {
        reject(err);
        throw err;
      }
    });
  };

  return {
    request
  };
};

exports.default = DialogFlow;
//# sourceMappingURL=DialogFlow.js.map