import dialogflow from "dialogflow";
import uuid from "uuid";
import {default_agent} from "../../Config/DialogFlow";
import {SharedProps} from "../../Bot";
import {handlerDialogFlow} from "./internal";

export class dialogFlow {
  constructor(Bot) {
    this.Bot = Bot;
    this.propsId = Bot.getId().origin;
    this.initDialogFlowProps();

    // selected agent
    this.agent = default_agent;
    this.projectId = this.agent.projectId;
    this.config = this.agent.config;

    // A unique identifier for the given session
    this.sessionId = uuid.v4();

    // Create a new session
    this.sessionClient = new dialogflow.SessionsClient(this.config);
    this.sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);

    // handler = handlerDialogFlow(Bot);
  }

  initDialogFlowProps() {
    if (SharedProps.store[this.propsId]["dialogFlow"] === undefined) {
      SharedProps.store[this.propsId]["dialogFlow"] = {
        isTalking: false
      };
    }
  }

  getParameter(responses) {
    const {fields} = responses[0].queryResult.parameters;
    const {displayName} = responses[0].queryResult.intent;
    const {allRequiredParamsPresent} = responses[0].queryResult;
    return {displayName, fields, allRequiredParamsPresent};
  }

  getQuery(msg) {
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

  chatGate(parameter, chatCallback) {
    const {fields, displayName} = parameter;
    if (SharedProps.store[this.propsId].dialogFlow.isTalking || displayName === "chat.talk" || displayName === "chat.silent") {
      if (Object.keys(fields).includes("chat")) {
        SharedProps.store[this.propsId].dialogFlow.isTalking = JSON.parse(fields.chat.stringValue);
      }
      return chatCallback();
    }
  }

  // Send request and log result
  listen() {
    return new Promise((resolve, reject) => {
      try {
        const {message} = this.Bot.props.event;
        const query = this.getQuery(message.text);
        this.sessionClient.detectIntent(query).then(responses => {
          const parameter = this.getParameter(responses);

          const {queryResult} = responses[0];
          const {fulfillmentText} = queryResult;

          const chatCallback = () => {
            const cleanResponses = {
              fulfillmentText,
              parameter
            };
            new handlerDialogFlow(this.Bot, cleanResponses);
            return resolve();
          };

          // if (fulfillmentText.length >= 1) {
          this.chatGate(parameter, chatCallback);
          // }

          console.log("[DialogFlow] isTalking", SharedProps.store[this.propsId].dialogFlow.isTalking);
          console.log("[DialogFlow] Parameter", JSON.stringify(parameter));
          console.log("[DialogFlow] Detected intent", responses[0].queryResult.displayName);
          console.log("[DialogFlow] responses:", JSON.stringify(responses));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
