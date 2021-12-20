const axios = require('axios')
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const FB = require("fb");
const myMap = require('./utils')

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const port = process.env.PORT || 3000;
const groupUrl = process.env.GROUP_URL;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);
//console.log(`\udc79`)
FB.setAccessToken(process.env.FB_ACCESS_TOKEN);

const convertFormat = (str) => {
    name = "";
    for (i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i) - 97;
        if (charCode >= 0) {
            name += myMap.get(str.charAt(i))
        }
        else {
            name += str.charAt(i)
        }
    }
    return name;
}

slackEvents.on('message', async (event) => {
    console.log(`Got message from user <@${event.user}>: ${event.text}`);
    const userInfo = await slackClient.users.info({
        user: event.user
    });
    const username = userInfo.user.name
    console.log(username)
    let message = event.text;
    (async () => {
        try {
            if (message.includes("#fbpost ")) {
                console.log("Going to post in FB!")
                message = message.replace("#fbpost ", "");
                formatedUsername = convertFormat(username)
                message += `\n ${formatedUsername}`;
                // let aa = `\u5E73\u621015`;
                FB.api(groupUrl, 'POST', { message }, function (response) {
                    console.log(response);
                });
            }
            if (message === 'greet me') {
                await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
            }
        } catch (error) {
            console.log("vul hoyeche")
            console.log(error)
        }
    })();
});

slackEvents.on('error', console.error);

slackEvents.start(port).then(() => {
    console.log(`Server started on port ${port}`)
});