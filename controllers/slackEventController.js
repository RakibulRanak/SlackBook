require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const fbAPI = require('../fb/fbApiCaller')
const messageFormatter = require('../utils/messageFormatter');
const fileProcessor = require('../utils/fileProcessor');
const eventSet = new Set();
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || 'NOT_UNDEFINED';
const slackBotToken = process.env.SLACK_BOT_TOKEN || 'NOT_UNDEFINED';
const slackUserToken = process.env.SLACK_USER_TOKEN || 'NOT_UNDEFINED';
const slackEvents = createEventAdapter(slackSigningSecret);
exports.slackEvents = slackEvents
const slackClient = new WebClient(slackBotToken);

slackEvents.on('message', async (event) => {
    try {
        if (event.subtype != "message_changed") {
            const userInfo = await slackClient.users.info({
                user: event.user
            });
            if (!userInfo.user.is_bot) {
                const currentEventId = Math.floor(event.event_ts);
                const username = userInfo.user.profile.real_name
                const email = userInfo.user.profile.email
                console.log(`Got message to post on facebook by ${username} (${email})`);
                let message = event.text;
                (async () => {
                    if (message.includes("#fbpost") && (!eventSet.has(currentEventId))) {
                        eventSet.add(currentEventId);
                        const { links, formattedMessage, lastLink, linksLength } = await messageFormatter.format(message, username);
                        message = formattedMessage;
                        if (event.files === undefined) {
                            if (!links) fbAPI.postWithoutLinkAndAttachments(message, event)
                            else fbAPI.postWithLinkAndAttachments(message, links[0], lastLink, linksLength, event)
                        }
                        else {
                            const { messageWithAttachments, publicFileUrlPreview, lastLink, linksLength } = await fileProcessor.process(event.files, slackClient, message, slackUserToken);
                            fbAPI.postWithLinkAndAttachments(messageWithAttachments, publicFileUrlPreview, lastLink, linksLength, event)
                        }
                    }
                    if (eventSet.size > 10) {
                        const val = Math.min(...eventSet);
                        eventSet.delete(val);
                    }
                })();
            }
        }
    } catch (error) {
        console.log("Slack error " + error.message)
    }

});

