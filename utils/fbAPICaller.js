const FB = require("fb");
const fs = require('fs')
FB.setAccessToken(process.env.FB_ACCESS_TOKEN);
const fbGroupID = process.env.FB_GROUP_ID;


exports.postWithoutLinkAndAttachments = (message) => {
    FB.api(`/${fbGroupID}/feed`, 'POST', { message }, function (response) {
        if (response.error) {
            console.log(response.error.message)
            fs.writeFileSync('./error.txt', `Fb api error: ${response.error.message}`)
        }
        else
            console.log("Succesfully posted on fb!")
    });
}

exports.postWithLinkAndAttachments = (message, publicLink, lastLink, linksLength) => {
    const words = message.split(" ");
    if ((words[words.length - 1] === lastLink || words[words.length - 1] === `\n\n\n${lastLink}`) && linksLength === 1) message += " .\n";
    FB.api(`/${fbGroupID}/feed?link=${publicLink}`, 'POST', { message }, function (response) {
        if (response.error) {
            console.log(response.error.message)
            fs.writeFileSync('./error.txt', `Fb api error: ${response.error.message}`)
        }
        else
            console.log("Succesfully posted on fb!")
    });
}

