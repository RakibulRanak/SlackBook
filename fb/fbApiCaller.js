const FB = require("fb");
const fbErrorNotifier = require('./fbErrorNotifier');
const fbAccessToken = process.env.FB_ACCESS_TOKEN
FB.setAccessToken(fbAccessToken);
FB.options({ version: 'v12.0' });
const fbGroupID = process.env.FB_GROUP_ID;

// These errors occurs randomly though the post request is successfull. Avoiding...
// GraphMethodException - Error Code 100
// OAuthException - Error Code 1

exports.handleFbResponse = (response) => {
    if (response.error) {
        if (response.error.code != 1 || response.error.code != 100) {
            console.log(`Fb api error: ${response.error.message} \n${response.error.type} - ${response.error.code}`);
            fbErrorNotifier.notify(event, response.error);
        }
        else
            console.log("Succesfully posted on fb!")

    }
    else
        console.log("Succesfully posted on fb!")
}

exports.postWithoutLinkAndAttachments = (message, event) => {
    FB.api(`/${fbGroupID}/feed`, 'POST', { message }, function (response) {
        this.handleFbResponse(response)
    });
}

exports.postWithLinkAndAttachments = (message, publicLink, lastLink, linksLength, event) => {
    const words = message.split(" ");
    if ((words[words.length - 1] === lastLink || words[words.length - 1] === `\n\n\n${lastLink}`) && linksLength === 1) message += " .\n";
    FB.api(`/${fbGroupID}/feed?link=${publicLink}`, 'POST', { message }, function (response) {
        this.handleFbResponse(response)
    });
}
