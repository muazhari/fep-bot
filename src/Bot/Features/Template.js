import { Bot, StoreAdvance, command_prefix, baseURL } from "../../Bot/internal";

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

  const bifest = () => {
    const backgroundImageURL = `${baseURL}/static/background`;
    console.log(backgroundImageURL);

    return Bot.sendMessage({
      type: "imagemap",
      baseUrl: backgroundImageURL,
      altText: "Bifest 2019",
      baseSize: { width: 1040, height: 1040 },
      actions: [
        {
          area: { x: 0, y: 0, width: 1040, height: 1040 },
          type: "uri",
          linkUri:
            "https://binus.ac.id/2019/05/binus-festival-2019-ajang-pameran-tahunan-yang-melahirkan-entrepreneur-berintegritas/"
        }
      ],
      video: {
        // originalContentUrl: `${baseURL}/static/imagemap/bifest2019.mp4`,
        originalContentUrl:
          "https://r2---sn-npoe7ney.googlevideo.com/videoplayback?expire=1564189277&ei=_U07XeeHKIuToAOX8pSQDA&ip=112.215.65.127&id=o-ANsMFQ0_Rr2D3G2l0LCu5NftSRrjT1eAdmRZoUJpwLTt&itag=22&source=youtube&requiressl=yes&mime=video%2Fmp4&ratebypass=yes&dur=60.162&lmt=1557567004104746&fvip=6&beids=9466586&c=WEB&txp=2216222&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=ALgxI2wwRAIgMMIZ5BPSU8iIP_bMS7QAKNPQJYmt9fMiIe8YIOttE1wCIDKSwXzy3RG4PmLXP_ZlHFQ18bAb7RXc-UU5dKz4B0xG&cm2rm=sn-xmjxajvh-jb3s7k,sn-nposk7l&fexp=9466586&req_id=3b4644aeeebaa3ee&rm=sn-npoz77l&ipbypass=yes&redirect_counter=3&cms_redirect=yes&mip=140.213.11.178&mm=34&mn=sn-npoe7ney&ms=ltu&mt=1564167695&mv=m&mvi=1&pl=24&lsparams=ipbypass,mip,mm,mn,ms,mv,mvi,pl&lsig=AHylml4wRgIhAIoJFZpC__NenmYw-5L7PG1HogJJB-VpcfrsGHbY2i1kAiEAnjzPaeCmQPUOlKW36nP6d9waxzuT9pO8GZGBtXpYmqU=",
        previewImageUrl: `${baseURL}/static/imagemap/bifest2019_preview.jpg`,
        area: {
          x: 156,
          y: 137,
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
