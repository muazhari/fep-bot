import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import routes from "./routes";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "fep-bot",
  api_key: "fep-bot",
  api_secret: "_R0PRhWo1KuScAycGwbmodqtsts"
});

import * as line from "@line/bot-sdk";

import config from "./Config/Line";

import Store from "./Services/Store";

Store.init();

const app = express();

app.disable("x-powered-by");

// View engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(
  logger("dev", {
    skip: () => app.get("env") === "test"
  })
);

// serve static and downloaded files
app.use(
  "/static",
  express.static(path.join(__dirname, "../src/Bot/Assets/static"))
);
app.use(
  "/downloaded",
  express.static(path.join(__dirname, "../src/Bot/Assets/downloaded"))
);

app.use("/webhook", line.middleware(config));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

// // Routes
app.use("/", routes);

app.use((err, req, res, next) => {
  if (err instanceof line.SignatureValidationFailed) {
    res.status(401).send(err.signature);
    return;
  } else if (err instanceof line.JSONParseError) {
    res.status(400).send(err.raw);
    return;
  }
  next(err); // will throw default 500
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).render("error", {
    message: err.message
  });
});

export default app;
