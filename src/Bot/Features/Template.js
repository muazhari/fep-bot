import {StoreAdvance, command_prefix, baseURL} from "../../Bot";
import YoutubeDL from "../../Bot/Helper/YoutubeDL";
import ResponseCheck from "../../Bot/Helper/ResponseCheck";
import Store from "../../Services/Store";

export const Template = Bot => {
  const {event} = Bot.props.event;

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
          {
            label: "Go to line.me",
            type: "uri",
            uri: "https://line.me"
          }, {
            label: "Say hello1",
            type: "postback",
            data: "hello こんにちは"
          }, {
            label: "言 hello2",
            type: "postback",
            data: "hello こんにちは",
            text: "hello こんにちは"
          }, {
            label: "Say message",
            type: "message",
            text: "Rice=米"
          }
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
          {
            label: "Yes",
            type: "message",
            text: "Yes!"
          }, {
            label: "No",
            type: "message",
            text: "No!"
          }
        ]
      }
    });
  };

  const bifest = () => {
    const backgroundImageURL = `${baseURL}/static/background`;

    const youtubeUrl = new YoutubeDL("https://www.youtube.com/watch?v=nikc3FeeVs8");
    const options = {
      force: false
    };

    youtubeUrl.generateUrl("bifest", options).then(({url: videoURL, thumbnail: thumbnailURL}) => {
      Bot.sendMessage({
        type: "imagemap",
        baseUrl: backgroundImageURL,
        altText: "Bifest 2019",
        baseSize: {
          width: 1040,
          height: 600
        },
        actions: [
          {
            area: {
              x: 0,
              y: 0,
              width: 1040,
              height: 600
            },
            type: "uri",
            linkUri: "https://binus.ac.id/2019/05/binus-festival-2019-ajang-pameran-tahunan-yang-melahirkan-entrepreneur-berintegritas/"
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
            linkUri: "https://binus.ac.id/2019/05/binus-festival-2019-ajang-pameran-tahunan-yang-melahirkan-entrepreneur-berintegritas/",
            label: "Lebih lengkap"
          }
        }
      });
    });
  };

  const binushack = () => {
    const backgroundImageURL = `${baseURL}/static/binushack`;

    Bot.sendMessage({
      type: "imagemap",
      baseUrl: backgroundImageURL,
      altText: "BINUSHACK 2019",
      baseSize: {
        width: 735,
        height: 1040
      },
      actions: [
        {
          area: {
            x: 0,
            y: 0,
            width: 735,
            height: 1040
          },
          type: "uri",
          linkUri: "https://bit.ly/binushack"
        }
      ]
    });
  };

  const test = () => {
    Bot.sendMessage({
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "image",
            url: "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip3.jpg",
            size: "full",
            aspectMode: "cover",
            aspectRatio: "1:1",
            gravity: "center"
          }, {
            type: "image",
            url: "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip15.png",
            position: "absolute",
            aspectMode: "fit",
            aspectRatio: "1:1",
            offsetTop: "0px",
            offsetBottom: "0px",
            offsetStart: "0px",
            offsetEnd: "0px",
            size: "full"
          }, {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "Brown Grand Hotel",
                        size: "xl",
                        color: "#ffffff"
                      }
                    ]
                  }, {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "icon",
                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                      }, {
                        type: "icon",
                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                      }, {
                        type: "icon",
                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                      }, {
                        type: "icon",
                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                      }, {
                        type: "icon",
                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                      }, {
                        type: "text",
                        text: "4.0",
                        color: "#a9a9a9"
                      }
                    ],
                    spacing: "xs"
                  }, {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "box",
                        layout: "baseline",
                        contents: [
                          {
                            type: "text",
                            text: "¥62,000",
                            color: "#ffffff",
                            size: "md",
                            flex: 0,
                            align: "end"
                          }, {
                            type: "text",
                            text: "¥82,000",
                            color: "#a9a9a9",
                            decoration: "line-through",
                            size: "sm",
                            align: "end"
                          }
                        ],
                        flex: 0,
                        spacing: "lg"
                      }
                    ]
                  }
                ],
                spacing: "xs"
              }
            ],
            position: "absolute",
            offsetBottom: "0px",
            offsetStart: "0px",
            offsetEnd: "0px",
            paddingAll: "20px"
          }
        ],
        paddingAll: "0px"
      }
    });
  };

  return {button, confirm, bifest, binushack, test};
};
