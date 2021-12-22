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
// app.post('/slack/slash', slashCommand.serve)


FB.setAccessToken(process.env.FB_ACCESS_TOKEN);

slackEvents.on('message', async (event) => {
    const currentEventId = event.event_ts;
    console.log(`Got message from user <@${event.user}>: ${event.text}`);
    const userInfo = await slackClient.users.info({
        user: event.user
    });
    const username = userInfo.user.name
    let message = event.text;
    (async () => {
        try {
            if (message.includes("#fbpost") && currentEventId != prevEventId) {
                console.log("Going to post in FB!")
                const regex = /<@[a-zA-Z0-9]{11}>/g;
                const linkRegex = /<http.{1,500}>/g;
                const link = message.match(linkRegex);
                if(link){
                     for(let i=0;i<link.length;i++){
                         const str = link[i];
                         link[i] = link[i].replace("<","");
                         link[i] = link[i].replace(">","");
                         message = message.replace(str,link[i]);
                     }
                }
                const mentions = message.match(regex);
                if(mentions){
                    for(let i=0;i<mentions.length;i++){
                        const mentionedUserInfo = await slackClient.users.info({
                            user: mentions[i].substring(2,13)
                        });
                        let userName = mentionedUserInfo.user.profile.display_name;
                        if(!mentionedUserInfo.user.profile.display_name)
                            userName = mentionedUserInfo.user.name;
                        message = message.replace(mentions[i],'@'+ userName);
                    }
                }
                message = message.replace("#fbpost", "");
                formatedUsername = format.convertFormat(username)
                message = formatedUsername + "@ˢˡᵃᶜᵏ" + `\n\n${message}`;
                if(event.files === undefined) {
                    if ( link === null) {
                        FB.api(`${groupUrl}/feed`, 'POST', { message }, function (response) {
                            console.log(response);
                        });
                    }
                    else {
                     FB.api(`${groupUrl}/feed?link=${link[0]}`, 'POST', { message }, function (response) {
                         console.log(response);
                     });
                    }
                 }
                 else {
                    if(!event.files[0].public_url_shared) await slackClient.files.sharedPublicURL({ token: slackUserToken , file :event.files[0].id})
                    console.log(event)
                    if ( event.files[0].mimetype.includes('image')) {
                        const url = await crawler.crawl(event.files[0].permalink_public);
                        FB.api(`${groupUrl}/photos?url=${url}`, 'POST', { message} , function (response) {
                            console.log(response);
                        });
                     }
                    else {
                        FB.api(`${groupUrl}/feed?link=${event.files[0].permalink_public}`, 'POST', { message }, function (response) {
                            console.log(response);
                        });
                    }
                 }
                 prevEventId = currentEventId;
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
