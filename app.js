const axios = require('axios')
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const FB = require("fb");
const myMap = require('./utils')
const crawler = require('./crawler')
// const fs = require('fs');
// const envfile = require('envfile')
// const sourcePath = '.env'
require('dotenv').config();
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const slackUserToken = process.env.SLACK_USER_TOKEN
const port = process.env.PORT || 3000;
const groupUrl = process.env.GROUP_URL;
const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

FB.setAccessToken(process.env.FB_ACCESS_TOKEN);


const convertFormat = (str) => {
    let name = "";
    for (i = 0; i < str.length; i++) {
        name += myMap.get(str.charAt(i))
    }
    return name;
}
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
            if (message.includes("#fbpost")) {
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
                     console.log(message);
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
                formatedUsername = convertFormat(username)
                message = formatedUsername + "@ˢˡᵃᶜᵏ" + `\n\n${message}`;
                if(event.files === undefined) {
                   FB.api(`${groupUrl}/feed`, 'POST', { message }, function (response) {
                       console.log(response);
                   });
                }
                else {
                   if(!event.files[0].public_url_shared) await slackClient.files.sharedPublicURL({ token: slackUserToken , file :event.files[0].id}) 
                   const url = await crawler.crawl(event.files[0].permalink_public);
                   FB.api(`${groupUrl}/photos?url=${url}`, 'POST', { message} , function (response) {
                    console.log(response);
                   });
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
slackEvents.on('error', console.error);
slackEvents.start(port).then(() => {
    console.log(`Server started on port ${port}`)
});