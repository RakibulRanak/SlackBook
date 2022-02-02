const FB = require("fb");
const fbTokenExpirationNotifier = require('./fbTokenExpirationNotifier');
const fbAccessToken = process.env.FB_ACCESS_TOKEN
FB.setAccessToken(fbAccessToken);
const fbGroupID = process.env.FB_GROUP_ID;


exports.postWithoutLinkAndAttachments = (message) => {
    FB.api(`/${fbGroupID}/feed`, 'POST', { message }, function (response) {
        if (response.error) {
            console.log(`Fb api error: ${response.error.message}`);
            if(response.error.type === 'OAuthException' ) {
                fbTokenExpirationNotifier.notify();
                console.log("Need to Generate Token");
            }
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
            console.log(`Fb api error: ${response.error.message}`);
            if(response.error.type === 'OAuthException' ) {
                fbTokenExpirationNotifier.notify();
                console.log("Need to generate Token");
            }
        }
        else
            console.log("Succesfully posted on fb!")
    });
}
