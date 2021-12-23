require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const format = require('../utils/formatter')
const crawler = require('../utils/crawler')
const linkExtractor = require('../utils/linkExtractor');
const mentionExtractor = require('../utils/mentionExtractor');
const fbAPI = require('../utils/fbAPICaller')

let prevEventId;

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const slackUserToken = process.env.SLACK_USER_TOKEN


const slackEvents = createEventAdapter(slackSigningSecret);
exports.slackEvents = slackEvents
const slackClient = new WebClient(slackToken);


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

                    const { link, formatedMessage } = linkExtractor.extract(message);
                    message = formatedMessage;
                    message = await mentionExtractor.extract(message);

                    message = message.replace("#fbpost", "");

                    formatedUsername = format.convertFormat(username);
                    message = formatedUsername + "@ˢˡᵃᶜᵏ" + `\n\n${message}`;

                    if (event.files === undefined) {
                        if (link === null) fbAPI.postWithoutLinkAndAttachments(message)
                        else fbAPI.postWithLink(message, link[0])
                    }
                    else {
                        let publicUrl = event.files[0].permalink_public;
                        if (!event.files[0].public_url_shared) {
                            const modifiedEvent = await slackClient.files.sharedPublicURL({ token: slackUserToken, file: event.files[0].id })
                            publicUrl = modifiedEvent.file.permalink_public
                        }

                        if (event.files[0].mimetype.includes('image')) {
                            const imageLinkWithExtension = await crawler.crawl(publicUrl);
                            fbAPI.postWithImage(message, imageLinkWithExtension);
                        }
                        else fbAPI.postWithAttachments(message, publicUrl)

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

