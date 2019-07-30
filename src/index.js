import app from './app';

const { PORT } = process.env;

let baseURL = process.env.BASE_URL

app.listen(PORT, () => {
  if (baseURL) {
    console.log(`listening on ${baseURL}:${PORT}`);
  } else {
//     console.log("It seems that BASE_URL is not set. Connecting to ngrok...")
//     ngrok.connect(PORT, (err, url) => {
//       if (err) throw err;

//       baseURL = url;
//       console.log(`listening on ${baseURL}`);
//     });
  }
});

