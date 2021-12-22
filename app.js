const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const FB = require("fb");
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const myMap = require('./utils')
const crawler = require('./crawler')
const axios = require('axios')


const port = process.env.PORT || 3000
const app = express()
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN;
const slackToken = process.env.SLACK_TOKEN;
const slackUserToken = process.env.SLACK_USER_TOKEN
const groupUrl = process.env.GROUP_URL;
const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);


const slackSlashCommand = (req, res, next) => {
    console.log(req.body)
    if (req.body.token === slackVerificationToken && req.body.command === '/zork') {
        // console.log("DHUKESE MAMA")
        const type = req.body.text.split(' ')[0];
        res.status(200).send("aaa")
        return (axios.post(req.body.response_url, {
            response_type: "in_channel",
            text: req.body.text,
        }))




        //res.send('Use this command followed by `button`, `menu`, or `dialog`.');

    }
}
app.use('/slack/events', slackEvents.expressMiddleware())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:  }))


app.post('/slack/slash', slackSlashCommand)




FB.setAccessToken(process.env.FB_ACCESS_TOKEN);

const convertFormat = (str) => {
    let name = "";
    for (i = 0; i < str.length; i++) {
        name += myMap.get(str.charAt(i))
    }
    return name;
}


slackEvents.on('message', async (event) => {
    console.log(`Got message from user <@${event.user}>: ${event.text}`);
    const userInfo = await slackClient.users.info({
        user: event.user
    });
    const username = userInfo.user.name
    let message = event.text;
    (async () => {
        try {
            if (message.includes("#fbpost")) {
                console.log("Going to post in FB!")
                const regex = /<@[a-zA-Z0-9]{11}>/g;
                const mentions = message.match(regex);
                if (mentions) {
                    for (let i = 0; i < mentions.length; i++) {
                        const mentionedUserInfo = await slackClient.users.info({
                            user: mentions[i].substring(2, 13)
                        });
                        let userName = mentionedUserInfo.user.profile.display_name;
                        if (!mentionedUserInfo.user.profile.display_name)
                            userName = mentionedUserInfo.user.name;
                        message = message.replace(mentions[i], '@' + userName);
                    }
                }
                message = message.replace("#fbpost", "");
                formatedUsername = convertFormat(username)
                message = formatedUsername + "@ˢˡᵃᶜᵏ" + `\n\n${message}`;

                if (event.files === undefined) {
                    FB.api(`${groupUrl}/feed`, 'POST', { message }, function (response) {
                        console.log(response);
                    });
                }
                else {
                    if (!event.files[0].public_url_shared) await slackClient.files.sharedPublicURL({ token: slackUserToken, file: event.files[0].id })
                    const url = await crawler.crawl(event.files[0].permalink_public);
                    FB.api(`${groupUrl}/photos?url=${url}`, 'POST', { message }, function (response) {
                        console.log(response);
                    });
                }

            }
            if (message === 'greet me') {
                await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
            }
        } catch (error) {
            console.log(error.data)
        }
    })();
});

// Starts server
app.listen(port, function () {
    console.log('Bot is listening on port ' + port)
})


// slackEvents.on('error', console.error);
