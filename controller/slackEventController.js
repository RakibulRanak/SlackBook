require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const format = require('../utils/formatter')
const crawler = require('../utils/crawler')
const linkExtractor = require('../utils/linkExtractor');
const mentionExtractor = require('../utils/mentionExtractor');
const boldExtractor = require('../utils/boldExtractor');
const italicExtractor = require('../utils/italicExtractor')
const fbAPI = require('../utils/fbAPICaller')
const messageFormattor = require('../utils/messageFormattor');

let prevEventId;

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackUserToken = process.env.SLACK_USER_TOKEN


const slackEvents = createEventAdapter(slackSigningSecret);
exports.slackEvents = slackEvents
const slackClient = new WebClient(slackBotToken);


slackEvents.on('message', async (event) => {
    try {
        if (event.user) {
            const currentEventId = event.event_ts;
            console.log(`Got message from user <@${event.user}>: ${event.text}`);
            const userInfo = await slackClient.users.info({
                user: event.user
            });
            const username = userInfo.user.profile.real_name
            let message = event.text;
            (async () => {

                if (message.includes("#fbpost") && currentEventId != prevEventId) {
                    console.log("Going to post in FB!")
                    const plainMessage = messageFormattor.extract(message);
                    message = plainMessage;
                    const { links, formatedMessage } = linkExtractor.extract(message);
                    message = formatedMessage;
                    message = await mentionExtractor.extract(message);
                    message = await boldExtractor.extract(message);
                    message = await italicExtractor.extract(message);
                   
                    if (message.match("&gt")) for ( let i = 0 ; i < message.length ; i++) message = message.replace("&gt;", "");
                    
                    message = message.replace("#fbpost ", "");
                    message = message.replace("# fbpost", "");
                    message = message.replace("#fbpost", "");

                    formatedUsername = format.convertFormat(username);
                    message = formatedUsername + " shared via slack" + `\n\n${message}`;

                    if (event.files === undefined) {
                        if (links === null) fbAPI.postWithoutLinkAndAttachments(message)
                        else fbAPI.postWithLink(message, links[0])
                    }
                    else {
                        if (event.files.length > 1) {
                            await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>!, you can not post multiple files/photos to facebook` })
                        }
                        else {
                            let publicUrl = event.files[0].permalink_public;
                            if (!event.files[0].public_url_shared) {
                                const modifiedEvent = await slackClient.files.sharedPublicURL({ token: slackUserToken, file: event.files[0].id })
                                publicUrl = modifiedEvent.file.permalink_public
                            }

                            // if (event.files[0].mimetype.includes('image')) {
                            //     const imageLinkWithExtension = await crawler.crawl(publicUrl);
                            //     fbAPI.postWithImage(message, imageLinkWithExtension);
                            // }
                            // else 
                            fbAPI.postWithAttachments(message, publicUrl)
                        }

                    }
                }
                if (message === 'greet me' && currentEventId != prevEventId) {
                    await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
                }
                prevEventId = currentEventId;
            })();
        }
    } catch (error) {
        console.log(error.data)
    }

});

