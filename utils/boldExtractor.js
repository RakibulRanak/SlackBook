
exports.extract = async (message) => {
    const regex = /\*.*?\*/g;
    const bold = message.match(regex);
    console.log("dhukse");
    if (bold) {
        console.log("Ki holo",bold);
        for (let i = 0; i < bold.length; i++) {
            console.log(typeof bold[i]);
            for ( let j = 1 ; j < bold[i].length-1 ; j++) {
                
            }
        //     const mentionedUserInfo = await slackClient.users.info({
        //         user: mentions[i].substring(2, 13)
        //     });
        //     let userName = mentionedUserInfo.user.profile.display_name;
        //     if (!mentionedUserInfo.user.profile.display_name)
        //         userName = mentionedUserInfo.user.name;
        //     message = message.replace(mentions[i], '@' + userName);
        }
    }
    return message;
}