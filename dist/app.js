"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

var _cloudinary = require("cloudinary");

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _botSdk = require("@line/bot-sdk");

var line = _interopRequireWildcard(_botSdk);

var _Line = require("./Config/Line");

var _Line2 = _interopRequireDefault(_Line);

var _Cloudinary = require("./Config/Cloudinary");

var _Cloudinary2 = _interopRequireDefault(_Cloudinary);

var _Store = require("./Services/Store");

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cloudinary2.default.config(_Cloudinary2.default);

exports.uploads = file => {
  return new Promise(resolve => {
    _cloudinary2.default.uploader.upload(file, result => {
      resolve({ url: result.url, id: result.public_id });
    }, { resource_type: "auto" });
  });
};

_Store2.default.init();

const app = (0, _express2.default)();

app.disable("x-powered-by");

// View engine setup
app.set("views", _path2.default.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use((0, _morgan2.default)("dev", {
  skip: () => app.get("env") === "test"
}));

// serve static and downloaded files
app.use("/static", _express2.default.static(_path2.default.join(__dirname, "../src/Bot/Assets/static")));
app.use("/downloaded", _express2.default.static(_path2.default.join(__dirname, "../src/Bot/Assets/downloaded")));

app.use("/twibbons", _express2.default.static(_path2.default.join(__dirname, "../src/Bot/Assets/twibbons")));

app.use("/webhook", line.middleware(_Line2.default));

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(_path2.default.join(__dirname, "../public")));

//  Routes
app.use("/", _routes2.default);

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
  res.status(err.status || 500).render("error", { message: err.message });
});

exports.default = app;
//# sourceMappingURL=app.js.map