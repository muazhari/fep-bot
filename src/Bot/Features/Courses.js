import {StoreAdvance, command_prefix} from "../../Bot";

const coursesList = {
  algo: [
    {
      sessionID: "6",
      date: "2019-10-02",
      title: "Program Control: Selection",
      thumbnailURL: "https://cdn.glitch.com/4f9c0695-9885-46cf-9502-8a0e1cd81f5b%2Falgo6.jpg?v=1569974062520",
      fileURL: "https://drive.google.com/file/d/19HVfWnc8WpwHVGFcCthtQo1U_t36j-7u/view"
    }, {
      sessionID: "9",
      date: "2019-10-23",
      title: "Program Control: Repetition",
      thumbnailURL: "https://cdn.glitch.com/4f9c0695-9885-46cf-9502-8a0e1cd81f5b%2Fb4217f31-7075-4835-ac71-c395ec5b55a9.image.png?v=1569978617229",
      fileURL: "https://drive.google.com/open?id=1HB0maKwS3bOZFDL42T-bDvgIcwm5J19B"
    }, {
      sessionID: "12",
      date: "2019-10-23",
      title: "Pointers and Arrays",
      thumbnailURL: "https://cdn.glitch.com/4f9c0695-9885-46cf-9502-8a0e1cd81f5b%2F5f56696b-4375-496a-adb7-7b979bd89fac.image.png?v=1569978704524",
      fileURL: "https://drive.google.com/file/d/19HVfWnc8WpwHVGFcCthtQo1U_t36j-7u/view"
    }, {
      sessionID: "17",
      date: "2019-10-30",
      title: "Material Review I",
      thumbnailURL: "https://cdn.glitch.com/4f9c0695-9885-46cf-9502-8a0e1cd81f5b%2Fc9b47332-69ed-47c0-841c-7356c1c5d0d6.image.png?v=1569978925517",
      fileURL: "https://drive.google.com/open?id=1cPbjT7UGDm9iEoU9XpnAJQrSeXkM29VR"
    }, {
      sessionID: "20",
      date: "2019-11-20",
      title: "Function and Recursion",
      thumbnailURL: "https://cdn.glitch.com/4f9c0695-9885-46cf-9502-8a0e1cd81f5b%2F64e64b45-df5f-4a02-81f3-d0952c34a76a.image.png?v=1569978942289",
      fileURL: "https://drive.google.com/open?id=10idtEp0bmhv4LPIPz2Fax9nYUEoDlxPa"
    }, {
      sessionID: "21",
      date: "2019-11-20",
      title: "Structures and Union and Memory Allocation",
      thumbnailURL: "https://cdn.glitch.com/4f9c0695-9885-46cf-9502-8a0e1cd81f5b%2F3b57dc6f-f3c4-4dc8-8fcc-e9b1f502d972.image.png?v=1569978958399",
      fileURL: "https://drive.google.com/open?id=1k1EtXq1y_t_VTee5DzZySdSLxClwQ5d7"
    }
    ]
}

const searchCourseByDate = courseName => {
  const currentDate = new Date()
  const tomorrowDate = new Date()

  currentDate.setHours(0, 0, 0, 0)
  tomorrowDate.setDate(currentDate.getDate() + 1)

  const sessionsData = coursesList[courseName].filter(course => {
    const courseDate = new Date(course.date).getTime()  
    return courseDate >= currentDate && courseDate <= tomorrowDate;
  })

  return sessionsData;
};

const searchCourseBySessionID = (courseName, sessionID) => {
  const sessionsData = coursesList[courseName].filter(course => {
    return course.sessionID === sessionID;
  });

  return sessionsData;
};

const searchSession = (courseName, args) => {
  let sessionsData;
  if (args[0]) {
      if(args[0] == 'now'){
        sessionsData = searchCourseByDate(courseName);
      } else {
        sessionsData = searchCourseBySessionID(courseName, args[0]);
      }
    } else {
      sessionsData = coursesList[courseName];
    }
  
  return sessionsData;
}

export const Courses = Bot => {
  const algo = args => {    
    const sessionsData = searchSession("algo", args);

    if (sessionsData.length === 0) {
      return Bot.replyText("Not found.");
    }

    const sessionsContents = sessionsData.map(({sessionID, date, title, thumbnailURL, fileURL}) => {
      return {
        thumbnailImageUrl: thumbnailURL,
        imageBackgroundColor: "#FFFFFF",
        text: `Session ${sessionID} - ${title}`,
        actions: [
          {
            type: "uri",
            label: "Open",
            uri: fileURL
          }
        ]
      };
    });

    Bot.sendMessage({
      type: "template",
      altText: "Algorithm & Programming Sessions list",
      template: {
        type: "carousel",
        columns: sessionsContents,
        imageAspectRatio: "square",
        imageSize: "cover"
      }
    });
  };

  return {algo};
};
