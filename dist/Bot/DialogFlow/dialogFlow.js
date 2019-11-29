"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dialogFlow = undefined;

var _dialogflow = require("dialogflow");

var _dialogflow2 = _interopRequireDefault(_dialogflow);

var _uuid = require("uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _DialogFlow = require("../../Config/DialogFlow");

var _Bot = require("../../Bot");

var _internal = require("./internal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dialogFlow = exports.dialogFlow = Bot => {
  const propsId = Bot.getId().origin;
  initDialogFlowProps();

  // selected agent
  const agent = _DialogFlow.default_agent;
  const projectId = agent.projectId;
  const config = agent.config;

  // A unique identifier for the given session
  const sessionId = _uuid2.default.v4();

  // Create a new session
  const sessionClient = new _dialogflow2.default.SessionsClient(config);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // handler = handlerDialogFlow(Bot);

  const initDialogFlowProps = () => {
    if (_Bot.shared_props[propsId]["dialogFlow"] === undefined) {
      _Bot.shared_props[propsId]["dialogFlow"] = { isTalking: false };
    }
  };

  const getParameter = responses => {
    const { fields } = responses[0].queryResult.parameters;
    const { displayName } = responses[0].queryResult.intent;
    const { allRequiredParamsPresent } = responses[0].queryResult;
    return { displayName, fields, allRequiredParamsPresent };
  };

  const getQuery = msg => {
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

  const chatGate = (parameter, chatCallback) => {
    const { fields, displayName } = parameter;
    if (_Bot.shared_props[propsId].dialogFlow.isTalking || displayName === "chat.talk") {
      if (Object.keys(fields).includes("chat")) {
        _Bot.shared_props[propsId].dialogFlow.isTalking = JSON.parse(fields.chat.stringValue);
      }
      return chatCallback();
    }
  };

  // Send request and log result
  const listen = () => {
    return new Promise((resolve, reject) => {
      try {
        const { message } = Bot.props.event;
        const query = getQuery(message.text);
        sessionClient.detectIntent(query).then(response => {
          const parameter = getParameter(response);

          const { queryResult } = response[0];
          const { fulfillmentText } = queryResult;

          const chatCallback = () => {
            const cleanResponses = { fulfillmentText, parameter };
            (0, _internal.handlerDialogFlow)(Bot, response);
            return resolve();
          };

          // if (fulfillmentText.length >= 1) {
          chatGate(parameter, chatCallback);
          // }

          console.log("isTalking", _Bot.shared_props[propsId].dialogFlow.isTalking);
          console.log("parameter", JSON.stringify(parameter));
          console.log("Detected intent", response[0].queryResult.displayName);
          console.log(JSON.stringify(response));
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  return {
    listen
  };
};
//# sourceMappingURL=dialogFlow.js.map