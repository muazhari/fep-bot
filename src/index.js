import app from './app';

const { PORT } = process.env;

let baseURL = process.env.BASE_URL

app.listen(PORT, () => {
  if (baseURL) {
    console.log(`listening on ${baseURL}:${PORT}`);
  } else {
    // ngrok.connect(PORT, (err, url) => {
    //   if (err) throw err;
    //   console.log(`listening on ${url}`);
    // });
  }
});

