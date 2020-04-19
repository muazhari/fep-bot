"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _botSdk = require("@line/bot-sdk");

var line = _interopRequireWildcard(_botSdk);

var _Bot = require("./Bot");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)();

/**
 * Bot Webhook
 */

// register a webhook handler with middleware
// about the middleware, please refer to doc
routes.post("/webhook", (req, res) => {
  const t0 = new Date();
  console.log(`[ROUTES] /webhook transmission at time ${t0}`);

  if (req.body.destination) {
    console.log("Destination User ID: ", req.body.destination);
  }

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  //handle events separately
  Promise.all(req.body.events.map(event => {
    new _Bot.Bot({
      event
    });
  })).then(result => res.json(result)).catch(err => {
    console.log(`[ROUTES] /webhook ERROR: ${err}`);
    res.status(500).end();
    throw err;
  });

  const t1 = new Date();
  const tDelta = t1.getTime() - t0.getTime();;
  console.log(`[ROUTES] /webhook transmission done at time ${t1} in ${tDelta}ms`);
});

/**
 * GET home page
 */
routes.get("/", (req, res) => {
  res.render("index", {
    title: "fep-bot splash web yeah!"
  });
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get("/list", (req, res, next) => {
  const {
    title
  } = req.query;

  if (title == null || title === "") {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render("index", {
    title
  });
});

exports.default = routes;
//# sourceMappingURL=routes.js.map