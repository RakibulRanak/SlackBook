require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const slackCommand = require('./controllers/slackCommandController')
const slackEvent = require('./controllers/slackEventController.js');

const port = process.env.PORT || 3000
const app = express()

app.use('/slack/events', slackEvent.slackEvents.expressMiddleware())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.post('/slack/commands', slackCommand.serve)

// Starts server
app.listen(port, function () {
    console.log('Bot is listening on port ' + port)
})


//slackEvents.on('error', console.error);
