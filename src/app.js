import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";

import * as line from "@line/bot-sdk";
import routes from "./routes";
import lineConfig from "./Config/Line";
import cloudinaryConfig from "./Config/Cloudinary";

import Store from "./Services/Store";

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

cloudinary.config(cloudinaryConfig);

Store.init();

const app = express();

app.disable("x-powered-by");

// View engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(
  logger("dev", {
    skip: () => app.get("env") === "test",
  })
);

// serve static and downloaded files
app.use("/static", express.static(path.join(__dirname, "../assets/static")));
app.use(
  "/downloaded",
  express.static(path.join(__dirname, "../assets/downloaded"))
);
app.use(
  "/twibbons",
  express.static(path.join(__dirname, "../assets/twibbons"))
);

app.use("/webhook", line.middleware(lineConfig));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "../public")));

//  Routes
app.use("/", routes);

app.use((err, req, res, next) => {
  if (err instanceof line.SignatureValidationFailed) {
    res.status(401).send(err.signature);
    return;
  }
  if (err instanceof line.JSONParseError) {
    res.status(400).send(err.raw);
    return;
  }
  console.error(`[UNHANDLED ERROR] ${err}`);
  next(err); // will throw default 500
});

// Catch as 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).render("error", {
    message: err.message,
  });
});

// Debug
// app.use((err, req, res, next) => {
//   console.log(`REQ ${req}`);
//   console.log(`RES ${res}`);
// });

export default app;
