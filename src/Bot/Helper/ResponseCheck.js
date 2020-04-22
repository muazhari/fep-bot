import request from "request";

const status = (url) => {
  return new Promise((resolve, reject) => {
    request(url).on("response", (response) => {
      resolve(response.statusCode);
    });
  });
};

export default {
  status,
};
