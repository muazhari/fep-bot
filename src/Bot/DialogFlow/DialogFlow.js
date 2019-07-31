import dialogflow from "dialogflow";
import uuid from "uuid";
import config from "../../Config/DialogFlow";
import { shared_props } from "../../Bot/internal";

export const DialogFlow = Bot => {
  const { message, source } = Bot.props.event;
  const projectId = "newagent-nlaqvy";
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(config);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const talk_check = responses => {
    const { fields } = responses[0].queryResult.parameters;
    const { displayName } = responses[0].queryResult.intent;
    if (displayName === "Feppi - talk" || displayName === "Feppi - silent") {
      if (Object.keys(fields).includes("talk")) {
        shared_props[Bot.getId().default]["status"] = fields.talk.stringValue === "true";
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

    const status = shared_props[Bot.getId().default].status? shared_props[Bot.getId().default].status: true;

    if (status && fulfillmentText.length >= 1) {
      Bot.replyText(fulfillmentText);
    }

    talk_check(responses);
    console.log(shared_props);
    console.log(shared_props[Bot.getId().default].status, status);
    console.log("Detected intent", responses[0].queryResult.intent.displayName);
  };

  return {
    talk
  };
};
