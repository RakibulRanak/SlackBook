require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const fbAPI = require('../fb/fbAPICaller')
const messageFormatter = require('../utils/messageFormatter');
const fileProcessor = require('../utils/fileProcessor');
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
            // console.log(`Got message from user <@${event.user}>: ${event.text}`);
            const username = userInfo.user.profile.real_name
            let message = event.text;
            (async () => {
                if (message.includes("#fbpost") && (!eventSet.has(currentEventId))) {
                    eventSet.add(currentEventId);
                    const { links, formattedMessage, lastLink, linksLength } = await messageFormatter.format(message, username);
                    message = formattedMessage;
                    if (event.files === undefined) {
                        if (!links) fbAPI.postWithoutLinkAndAttachments(message)
                        else fbAPI.postWithLinkAndAttachments(message, links[0], lastLink, linksLength)
                    }
                    else {
                        const { messageWithAttachments, publicFileUrlPreview, lastLink, linksLength } = await fileProcessor.process(event.files, slackClient, message, slackUserToken);
                        fbAPI.postWithLinkAndAttachments(messageWithAttachments, publicFileUrlPreview, lastLink, linksLength)
                    }
                }
                if (message === 'greet me' && (!eventSet.has(currentEventId))) {
                    eventSet.add(currentEventId);
                    await slackClient.chat.postEphemeral({ thread_broadcast: false, thread_ts: event.thread_ts, channel: event.channel, user: event.user, text: `Hello <@${event.user}>! :tada:` })
                }
                if (eventSet.size > 10) {
                    const val = Math.min(...eventSet);
                    eventSet.delete(val);
                }
            })();
        }
    } catch (error) {
        console.log(error.message)
    }

});

