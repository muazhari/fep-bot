import dialogflow from "dialogflow";
import uuid from "uuid";
import config from "../../Config/DialogFlow";

const DialogFlow = async Bot => {
  const projectId = "newagent-nlaqvy";
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = await new dialogflow.SessionsClient(config);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // Send request and log result
  const request = message => {
    console.log(config, message);
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

export default DialogFlow;
