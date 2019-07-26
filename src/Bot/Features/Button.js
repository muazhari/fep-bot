import { Bot, StoreAdvance, command_prefix, baseURL } from "../../Bot/internal";

export const Button = Bot => {
  const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;
  const { event } = Bot.props.event

  const view = args => {
    Bot.client.replyMessage(event.replyToken, {
      type: "template",
      altText: "Buttons alt text",
      template: {
        type: "buttons",
        thumbnailImageUrl: buttonsImageURL,
        title: "My button sample",
        text: "Hello, my button",
        actions: [
          { label: "Go to line.me", type: "uri", uri: "https://line.me" },
          { label: "Say hello1", type: "postback", data: "hello こんにちは" },
          {
            label: "言 hello2",
            type: "postback",
            data: "hello こんにちは",
            text: "hello こんにちは"
          },
          { label: "Say message", type: "message", text: "Rice=米" }
        ]
      }
    });
  };

  return {
    view
  };
};
