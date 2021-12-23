const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const FB = require("fb");
require('dotenv').config();
const format = require('../utils/format')
const crawler = require('../utils/crawler')
const linkExtractor = require('../utils/linkExtractor');
const mentionExtractor = require('../utils/mentionExtractor');
let prevEventId;
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const slackUserToken = process.env.SLACK_USER_TOKEN
const groupUrl = process.env.GROUP_URL;
const slackEvents = createEventAdapter(slackSigningSecret);
exports.slackEvents = slackEvents

const slackClient = new WebClient(slackToken);

FB.setAccessToken(process.env.FB_ACCESS_TOKEN);

slackEvents.on('message', async (event) => {
    try {
        if (event.user) {
            const currentEventId = event.event_ts;
            console.log(`Got message from user <@${event.user}>: ${event.text}`);
            const userInfo = await slackClient.users.info({
                user: event.user
            });
            const username = userInfo.user.name
            let message = event.text;
            (async () => {

                if (message.includes("#fbpost") && currentEventId != prevEventId) {
                    console.log("Going to post in FB!")
                    const {link,formatedMessage} = linkExtractor.extract(message);
                    message = formatedMessage;
                    message = await mentionExtractor.extract(message);
                    
                    message = message.replace("#fbpost", "");
                    formatedUsername = format.convertFormat(username)
                    message = formatedUsername + "@ˢˡᵃᶜᵏ" + `\n\n${message}`;
                    if (event.files === undefined) {
                        if (link === null) {
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
                        if (!event.files[0].public_url_shared) await slackClient.files.sharedPublicURL({ token: slackUserToken, file: event.files[0].id })
                        console.log(event)
                        if (event.files[0].mimetype.includes('image')) {
                            const url = await crawler.crawl(event.files[0].permalink_public);
                            FB.api(`${groupUrl}/photos?url=${url}`, 'POST', { message }, function (response) {
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

            })();
        }
    } catch (error) {
        console.log(error.data)
    }

});

