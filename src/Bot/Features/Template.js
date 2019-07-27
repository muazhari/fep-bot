import { Bot, StoreAdvance, command_prefix, baseURL } from "../../Bot/internal";
import YoutubeDL from "../../Bot/Helper/YoutubeDL";
import ResponseCheck from "../../Bot/Helper/ResponseCheck";
import Store from "../../Services/Store";


export const Template = Bot => {
  const { event } = Bot.props.event;

  const button = () => {
    const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;
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

  const bifest = async () => {
    const backgroundImageURL = `${baseURL}/static/background`;
    
    
    const youtubeUrl = new YoutubeDL('https://www.youtube.com/watch?v=nikc3FeeVs8')
    const options = {
      force: true
    }
    const {url: videoURL, thumbnail: thumbnailURL} = await youtubeUrl.generateUrl('bifest', options)
    console.log(videoURL)

    return Bot.sendMessage({
      type: "imagemap",
      baseUrl: backgroundImageURL,
      altText: "Bifest 2019",
      baseSize: { width: 1040, height: 600 },
      actions: [
        {
          area: { x: 0, y: 0, width: 1040, height: 600 },
          type: "uri",
          linkUri:
            "https://binus.ac.id/2019/05/binus-festival-2019-ajang-pameran-tahunan-yang-melahirkan-entrepreneur-berintegritas/"
        }
      ],
      video: {
        // originalContentUrl: `${baseURL}/static/imagemap/bifest2019.mp4`,
        previewImageUrl: `${baseURL}/static/imagemap/bifest2019_preview.jpg`,
        originalContentUrl: videoURL,
        // previewImageUrl: thumbnailURL,
        area: {
          x: 156,
          y: 126,
          width: 738,
          height: 371
        },
        externalLink: {
          linkUri:
            "https://binus.ac.id/2019/05/binus-festival-2019-ajang-pameran-tahunan-yang-melahirkan-entrepreneur-berintegritas/",
          label: "Lebih lengkap"
        }
      }
    });
  };

  return {
    button,
    confirm,
    bifest
  };
};
