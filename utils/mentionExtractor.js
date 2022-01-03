const { WebClient } = require('@slack/web-api');
const slackToken = process.env.SLACK_TOKEN;
const slackClient = new WebClient(slackToken);
exports.extract = async(message) =>{
    const regex = /<@[a-zA-Z0-9]{11}>/g;
    const mentions = message.match(regex);
    if (mentions) {
        for (let i = 0; i < mentions.length; i++) {
            const mentionedUserInfo = await slackClient.users.info({
                user: mentions[i].substring(2, 13)
            });
            let userName = mentionedUserInfo.user.profile.display_name;
            if (!mentionedUserInfo.user.profile.display_name)
                userName = mentionedUserInfo.user.name;
            message = message.replace(mentions[i], '@' + userName);
        }
    }
    return message;
}