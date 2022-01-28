require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const slackCommand = require('./controllers/slackCommandController')
const slackEvent = require('./controllers/slackEventController.js');
const port = process.env.PORT || 3000
const app = express()
const rateLimit = require('express-rate-limit');
app.set('trust proxy', 1);
const limiter = rateLimit({
    max: 10, //1 request
    windowMs: 60 * 1000, //1000 = 1 second
    message: 'too many requests sent by this ip, please try again in an hour !'
});

app.use('/slack/events', limiter, slackEvent.slackEvents.expressMiddleware())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.post('/slack/commands', limiter, slackCommand.serve)

// Starts server
app.listen(port, function () {
    console.log('Bot is listening on port ' + port)
})

slackEvent.slackEvents.on('error', () => { });

