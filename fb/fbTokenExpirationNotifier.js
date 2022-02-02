const { WebClient } = require('@slack/web-api');
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(slackBotToken);

exports.notify = async () => {
    await slackClient.chat.postMessage({channel : process.env.ADMINISTRATOR_SLACK_MEMBER_ID,token: slackBotToken , text : `Facebook user access token is expired . \n Please sign in to facebook with your organizational facebook account . \n Then go to this link with the same browser https://developers.facebook.com/tools/explorer/ to generate new access token. \n and update your server environment` });
}

