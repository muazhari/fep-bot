import dialogflow from "dialogflow";
import uuid from "uuid";

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
const TextFlow = async (Bot, projectId = "newagent-nlaqvy") => {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // Send request and log result
  const request = message => {
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

    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    return result;
  };

  return {
    request
  };
};

export default TextFlow;
