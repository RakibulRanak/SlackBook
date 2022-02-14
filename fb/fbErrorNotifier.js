const { WebClient } = require('@slack/web-api');
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(slackBotToken);
const administrator_1 = process.env.ADMINISTRATOR_SLACK_MEMBER_ID_1;
const administrator_2 = process.env.ADMINISTRATOR_SLACK_MEMBER_ID_2;

exports.notify = async (event, error) => {
    try {
        await slackClient.chat.postEphemeral({ thread_broadcast: false, thread_ts: event.thread_ts, channel: event.channel, user: event.user, text: 'Your message may not be posted on FB due to an error. A notification is also sent to your system administrator to take action. Meanwhile sit back and try later!' })
        await slackClient.chat.postMessage({ channel: administrator_1, token: slackBotToken, text: `Someone tried to post on facebook through slack but it may have failed.\n FB API ERROR : ${error.type} (${error.code}) : ${error.message}\nVisit this page to know about the error - https://developers.facebook.com/docs/graph-api/guides/error-handling/` });
        // if you want to send error message to administrator_2 also comment out next line
        //await slackClient.chat.postMessage({ channel: administrator_2, token: slackBotToken, text: `Someone tried to post on facebook through slack but it may have failed.\n FB API ERROR : ${error.message}.\n${error.type} - ${error.code} \nVisit this page to know about the error - https://developers.facebook.com/docs/graph-api/guides/error-handling/` });
    }
    catch (error) {
        console.log("Slack error " + error.message)
    }
}

