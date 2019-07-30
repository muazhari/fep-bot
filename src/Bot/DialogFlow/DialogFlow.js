import { Assistant, AssistantLanguage } from "nodejs-assistant";
import DialogFlow from "../../Config/DialogFlow";

const TextAssistant = async Bot => {
  const credentials = await DialogFlow.getCredentials();
  const assistant = new Assistant(credentials, {
    deviceId: "fep-bot",
    deviceModelId: "fep-bot-1eebc-feppi-jez3yd",
    locale: AssistantLanguage.ENGLISH
  });

  const conversation = assistant.startTextConversation();

  return conversation;
  // conversation
  //   .on("message", text => console.log("Assistant: ", text))
  //   .send("Hi!");
};

export default TextAssistant;
