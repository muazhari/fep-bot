import { Bot, StoreAdvance, command_prefix, baseURL } from "../../Bot/internal";

export const Template = Bot => {
  const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;
  console.log(buttonsImageURL);
  const { event } = Bot.props.event;

  const button = () => {
    Bot.sendMessage({
      type: "template",
      altText: "This is a buttons template",
      template: {
        type: "buttons",
        thumbnailImageUrl: buttonsImageURL,
        imageAspectRatio: "rectangle",
        imageSize: "cover",
        imageBackgroundColor: "#FFFFFF",
        title: "Menu",
        text: "Please select",
        defaultAction: {
          type: "uri",
          label: "View detail",
          uri: "http://example.com/page/123"
        },
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

  const confirm = () => {
    return Bot.sendMessage({
      type: "template",
      altText: "Confirm alt text",
      template: {
        type: "confirm",
        text: "Do it?",
        actions: [
          { label: "Yes", type: "message", text: "Yes!" },
          { label: "No", type: "message", text: "No!" }
        ]
      }
    });
  };

  const imap = () => {
    return Bot.sendMessage({
      type: "imagemap",
      baseUrl: `${baseURL}/static/rich`,
      altText: "Imagemap alt text",
      baseSize: { width: 1040, height: 1040 },
      actions: [
        {
          area: { x: 0, y: 0, width: 520, height: 520 },
          type: "uri",
          linkUri: "https://store.line.me/family/manga/en"
        },
        {
          area: { x: 520, y: 0, width: 520, height: 520 },
          type: "uri",
          linkUri: "https://store.line.me/family/music/en"
        },
        {
          area: { x: 0, y: 520, width: 520, height: 520 },
          type: "uri",
          linkUri: "https://store.line.me/family/play/en"
        },
        {
          area: { x: 520, y: 520, width: 520, height: 520 },
          type: "message",
          text: "URANAI!"
        }
      ],
      video: {
        originalContentUrl: `${baseURL}/static/imagemap/video.mp4`,
        previewImageUrl: `${baseURL}/static/imagemap/preview.jpg`,
        area: {
          x: 280,
          y: 385,
          width: 480,
          height: 270
        },
        externalLink: {
          linkUri: "https://line.me",
          label: "LINE"
        }
      }
    });
  };

  return {
    button,
    confirm,
    imap
  };
};
