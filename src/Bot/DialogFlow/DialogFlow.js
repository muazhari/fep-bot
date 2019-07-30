import dialogflow from "dialogflow";
import uuid from "uuid";
import config from "../../Config/DialogFlow";

export const DialogFlow = Bot => {
  const { message } = Bot.props.event;
  const projectId = "newagent-nlaqvy";
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(config);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  
  const phrases = {
    talk: [
    'feppi',
    'mulai bicara'
    ],
    silent: [
      'feppi selesai',
      'berhenti bicara'
    ]
  }
  
  let intent_status = false
  
  // Send request and log result
  const talk = async msg => {
    if (phrases.talk.includes(msg.toLowerCase())) intent_status = true
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
    if (phrases.silent.includes(msg.toLowerCase())) intent_status = false
  };

  return {
    talk
  };
};
