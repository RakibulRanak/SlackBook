const { WebClient } = require('@slack/web-api');
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(slackBotToken);
const administrator_1 = process.env.ADMINISTRATOR_SLACK_MEMBER_ID_1;
const administrator_2 = process.env.ADMINISTRATOR_SLACK_MEMBER_ID_2;

exports.notify = async (event, message) => {
    try {
        await slackClient.chat.postEphemeral({ thread_broadcast: false, thread_ts: event.thread_ts, channel: event.channel, user: event.user, text: 'Your message was not posted on FB due to an error. A notification is also sent to your system administrator to take action. Meanwhile sit back and try later!' })
        await slackClient.chat.postMessage({ channel: administrator_1, token: slackBotToken, text: `Someone tried to post on facebook through slack but it failed.\n FB API ERROR : ${message}. \n If the error is related to expiration or malforemed token,Please sign in to facebook with your organizational facebook account . \n Then go to this link with the same browser https://developers.facebook.com/tools/explorer/ to generate new access token and update your server environment. You can debug the current token here before generating a new one > https://developers.facebook.com/tools/debug/accesstoken` });
        // if you want to send error message to administrator_2 also comment out next line
        //await slackClient.chat.postMessage({ channel: administrator_2, token: slackBotToken, text: `Someone tried to post on facebook through slack but it failed.\n FB API ERROR : ${message}. \n If the error is related to expiration or malforemed token,Please sign in to facebook with your organizational facebook account . \n Then go to this link with the same browser https://developers.facebook.com/tools/explorer/ to generate new access token and update your server environment. You can debug the current token here before generating a new one > https://developers.facebook.com/tools/debug/accesstoken` });
    }
    catch(error) {
        console.log("Slack error " + error.message) 
    }
}

