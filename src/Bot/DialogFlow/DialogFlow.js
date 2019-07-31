import dialogflow from "dialogflow";
import uuid from "uuid";
import { default_agent } from "../../Config/DialogFlow";
import { shared_props } from "../../Bot";

export class DialogFlow {
  constructor(Bot, projectId, config) {
    this.Bot = Bot;

    // selected agent
    this.projectId = projectId || default_agent.projectId;
    this.config = config || default_agent.config;

    // A unique identifier for the given session
    this.sessionId = uuid.v4();

    // Create a new session
    this.sessionClient = new dialogflow.SessionsClient(this.config);
    this.sessionPath = this.sessionClient.sessionPath(
      this.projectId,
      this.sessionId
    );
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

  chat_switch(parameter) {
    const props_id = this.Bot.getId().default;
    const { fields, displayName } = parameter;
    if (displayName === "chat.talk" || displayName === "chat.silent") {
      if (Object.keys(fields).includes("chat")) {
        shared_props[props_id]["status"] = fields.chat.stringValue === "true";
      }
    }
  }

  // Send request and log result
  async chat(msg) {
    const props_id = this.Bot.getId().default;
    const query = this.get_query(msg);
    const responses = await this.sessionClient.detectIntent(query);
    const parameter = this.get_parameter(responses);

    const { queryResult } = responses[0];
    const { fulfillmentText } = queryResult;

    const status =
      shared_props[props_id].status === undefined
        ? false
        : shared_props[props_id].status;

    if (status && fulfillmentText.length >= 1) {
      return { fulfillmentText, parameter };
    }

    this.chat_switch(parameter);

    // console.log(responses[0].queryResult)
    console.log("parameter", parameter);
    console.log("shared_props", shared_props[props_id].status, status);
    console.log("Detected intent", responses[0].queryResult.displayName);
  }
}
