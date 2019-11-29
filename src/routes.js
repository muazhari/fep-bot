import { Router } from 'express';
import axios from 'axios'
import * as line from '@line/bot-sdk';

import { Bot } from './Bot'

const routes = Router();

/**
 * Bot Webhook
 */


// register a webhook handler with middleware
// about the middleware, please refer to doc
routes.post('/webhook', (req, res) => {
  if (req.body.destination) {
    console.log("Destination User ID: ", req.body.destination);
  }
  
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  
  //handle events separately
  Promise.all(req.body.events.map(event => {
    new Bot(event)
  }))
    .then(result => res.json(result))
    .catch(err => {
      console.log(err)
      res.status(500).end();
      throw err
    })
})


/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'fep-bot splash web yeah!' });
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
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

export default routes;
