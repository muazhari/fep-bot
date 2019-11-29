import dialogflow from "dialogflow";
import uuid from "uuid";
import { default_agent } from "../../Config/DialogFlow";
import { shared_props } from "../../Bot";

export class DialogFlow {
  constructor(Bot) {
    this.Bot = Bot;
    this.initDialogFlowProps();

    // selected agent
    this.agent = default_agent;
    this.projectId = this.agent.projectId;
    this.config = this.agent.config;

    // A unique identifier for the given session
    this.sessionId = uuid.v4();

    // Create a new session
    this.sessionClient = new dialogflow.SessionsClient(this.config);
    this.sessionPath = this.sessionClient.sessionPath(
      this.projectId,
      this.sessionId
    );

    this.propsId = this.Bot.getId().origin;
  }
  
  initDialogFlowProps(){
    if (shared_props[this.propsId]["dialogFlow"] === undefined) {
      shared_props[this.propsId]["dialogFlow"] = { isTalking: false };
    }
  }

  getParameter(responses) {
    const { fields } = responses[0].queryResult.parameters;
    const { displayName } = responses[0].queryResult.intent;
    const { allRequiredParamsPresent } = responses[0].queryResult;
    return { displayName, fields, allRequiredParamsPresent };
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
    const { fields, displayName } = parameter;
    if (
      shared_props[this.propsId].dialogFlow.isTalking ||
      displayName === "chat.talk"
    ) {
      if (Object.keys(fields).includes("chat")) {
        shared_props[this.propsId].dialogFlow.isTalking = JSON.parse(
          fields.chat.stringValue
        );
      }
      return chatCallback();
    }
  }

  // Send request and log result
  chat() {
    return new Promise((resolve, reject) => {
      try {
        const { message } = this.Bot.props.event;
        const query = this.getQuery(message.text);
        this.sessionClient.detectIntent(query).then(responses => {
          const parameter = this.getParameter(responses);

          const { queryResult } = responses[0];
          const { fulfillmentText } = queryResult;

          const chatCallback = () => {
            return resolve({ fulfillmentText, parameter });
          };

          // if (fulfillmentText.length >= 1) {
          this.chatGate(parameter, chatCallback);
          // }

          console.log(
            "isTalking",
            shared_props[this.propsId].dialogFlow.isTalking
          );
          console.log("parameter", JSON.stringify(parameter));
          console.log("Detected intent", responses[0].queryResult.displayName);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
