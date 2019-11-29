import dialogflow from "dialogflow";
import uuid from "uuid";
import {default_agent} from "../../Config/DialogFlow";
import {shared_props} from "../../Bot";

export class DialogFlow {
  constructor(Bot) {
    this.Bot = Bot;
    this.get_parameter = this.get_parameter.bind(this);
    this.get_query = this.get_query.bind(this);
    this.chat_switch = this.chat_switch.bind(this);
    this.chat = this.chat.bind(this);

    // selected agent
    this.agent = default_agent;
    this.projectId = this.agent.projectId;
    this.config = this.agent.config;

    // A unique identifier for the given session
    this.sessionId = uuid.v4();

    // Create a new session
    this.sessionClient = new dialogflow.SessionsClient(this.config);
    this.sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);

    this.temp_chat_switch = true;

    this.propsId = this.Bot.getId().origin;
  }
  get_parameter(responses) {
    const {fields} = responses[0].queryResult.parameters;
    const {displayName} = responses[0].queryResult.intent;
    const {allRequiredParamsPresent} = responses[0].queryResult;
    return {displayName, fields, allRequiredParamsPresent};
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
    const {fields, displayName} = parameter;
    if (displayName === "chat.talk" || displayName === "chat.silent") {
      if (Object.keys(fields).includes("chat")) {
        shared_props[this.propsId]["status"] = JSON.parse(fields.chat.stringValue);
        return chat_switch_callback();
      }
    }
    return default_callback();
  }

  // Send request and log result
  chat() {
    return new Promise((resolve, reject) => {
      try {
        const {message} = this.Bot.props.event;
        const query = this.get_query(message.text);
        this.sessionClient.detectIntent(query).then(responses => {
          const parameter = this.get_parameter(responses);

          const {queryResult} = responses[0];
          const {fulfillmentText} = queryResult;

          const status = shared_props[this.propsId].status === undefined
            ? false
            : shared_props[this.propsId].status;

          const chat_switch_callback = () => {
            return resolve({fulfillmentText, parameter});
          };

          const default_callback = () => {
            if (status) {
              return resolve({fulfillmentText, parameter});
            }
          };

          if (fulfillmentText.length >= 1) {
            this.chat_switch(parameter, chat_switch_callback, default_callback);
          }

          console.log("parameter", parameter);
          console.log("shared_props", shared_props[this.propsId].status, status);
          console.log("Detected intent", responses[0].queryResult.displayName);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
