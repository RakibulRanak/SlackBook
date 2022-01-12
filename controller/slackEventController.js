require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const format = require('../utils/formatter')
const crawler = require('../utils/crawler')
const linkExtractor = require('../utils/linkExtractor');
const mentionExtractor = require('../utils/mentionExtractor');
const formatExtractor = require('../utils/formatExtractor');
const fbAPI = require('../utils/fbAPICaller')
const messageFormattor = require('../utils/messageFormatter');

const eventSet = new Set();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackUserToken = process.env.SLACK_USER_TOKEN


const slackEvents = createEventAdapter(slackSigningSecret);
exports.slackEvents = slackEvents
const slackClient = new WebClient(slackBotToken);

slackEvents.on('message', async (event) => {
    try {
        const userInfo = await slackClient.users.info({
            user: event.user
        });
        if (!userInfo.user.is_bot) {
            const currentEventId = Math.floor(event.event_ts);
            console.log(`Got message from user <@${event.user}>: ${event.text}`);
            const username = userInfo.user.profile.real_name
            let message = event.text;
            (async () => {
                if (message.includes("#fbpost") && (!eventSet.has(currentEventId))) {
                    eventSet.add(currentEventId);
                    console.log("Going to post in FB!")
                    const plainMessage = messageFormattor.extract(message);
                    message = plainMessage;
                    const { links, formatedMessage } = linkExtractor.extract(message);
                    message = formatedMessage;
                    message = await mentionExtractor.extract(message);
                    if (message.match("&gt")) for (let i = 0; i < message.length; i++) message = message.replace("&gt;", "");
                    if (message.match("&amp")) for (let i = 0; i < message.length; i++) message = message.replace("&amp;", "&");
                    message = await formatExtractor.extract(message);

                    message = message.replace("#fbpost ", "");
                    message = message.replace("# fbpost", "");
                    message = message.replace("#fbpost", "");

                    formatedUsername = format.convertFormat(username, 'bold');
                    message = formatedUsername + " shared via slack" + `\n\n${message}`;

                    if (event.files === undefined) {
                        if (links === null) fbAPI.postWithoutLinkAndAttachments(message)
                        else fbAPI.postWithLink(message, links[0])
                    }
                    else {
                        let publicFileUrlPreview = event.files[0].permalink_public;
                        for (let fileNo = 0; fileNo < event.files.length; fileNo++) {
                            let publicFlleUrlText = event.files[fileNo].permalink_public;
                            if (!event.files[fileNo].public_url_shared) await slackClient.files.sharedPublicURL({ token: slackUserToken, file: event.files[fileNo].id })
                            message += ("\n" + publicFlleUrlText + "\n");
                        }
                        fbAPI.postWithAttachments(message, publicFileUrlPreview)
                    }
                }
                if (message === 'greet me' && (!eventSet.has(currentEventId)))  {
                    await slackClient.chat.postEphemeral({ thread_broadcast: false, thread_ts: event.thread_ts, channel: event.channel, user: event.user, text: `Hello <@${event.user}>! :tada:` })
                    //await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
                }
                if(eventSet.size>10){
                    const val = Math.min(...eventSet);
                    eventSet.delete(val);
                }
            })();
        }
    } catch (error) {
        console.log(error.data)
    }

});

