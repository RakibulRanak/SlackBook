const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const FB = require("fb");

require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const slashCommand = require('./slashCommand')

const port = process.env.PORT || 3000
const app = express()

const format = require('./format')
const crawler = require('./crawler')
let prevEventId;


const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const slackToken = process.env.SLACK_TOKEN;
const slackUserToken = process.env.SLACK_USER_TOKEN
const groupUrl = process.env.GROUP_URL;
const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

app.use('/slack/events', slackEvents.expressMiddleware())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.post('/slack/slash', slashCommand.serve)


FB.setAccessToken(process.env.FB_ACCESS_TOKEN);


// Starts server
app.listen(port, function () {
    console.log('Bot is listening on port ' + port)
})


// slackEvents.on('error', console.error);
