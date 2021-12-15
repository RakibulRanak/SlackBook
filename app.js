const axios = require('axios')
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const port = process.env.SLACK_PORT || 3000;
const fbUrl = process.env.FB_URL
const FB = require("fb");
const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

FB.setAccessToken(process.env.FB_ACCESS_TOKEN);


slackEvents.on('message', (event) => {
    console.log(`Got message from user ${event.user}: ${event.text}`);
    const message = event.text;
    (async () => {
        try {
            if (message.includes("#gunda")) {
                console.log("ddddd")
                FB.api('/950848322519530/feed', 'POST',{message}, function(
                    response
                  ) {
                    console.log(response);
                  });
            }
            if (message === 'greet me') {
                await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
            }
        } catch (error) {
            console.log(error.data)
        }
    })();
});

slackEvents.on('error', console.error);

slackEvents.start(port).then(() => {
    console.log(`Server started on port ${port}`)
});