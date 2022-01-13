const { WebClient } = require('@slack/web-api');
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(slackBotToken);
exports.extract = async (message) => {
    const regex = /<@[a-zA-Z0-9]{11}>/g;
    if (message.match("<!here>")) for (let i = 0; i < message.length; i++) message = message.replace('<!here>', "@𝐡𝐞𝐫𝐞");
    const mentions = message.match(regex);
    if (mentions) {
        for (let i = 0; i < mentions.length; i++) {
            const mentionedUserInfo = await slackClient.users.info({
                user: mentions[i].substring(2, 13)
            });
            let userName = mentionedUserInfo.user.profile.display_name;
            if (!mentionedUserInfo.user.profile.display_name)
                userName = mentionedUserInfo.user.profile.real_name;
            message = message.replace(mentions[i], '@' + userName);
        }
    }
    return message;
}