const FB = require("fb");
FB.setAccessToken(process.env.FB_ACCESS_TOKEN);
const fbGroupID = process.env.FB_GROUP_ID;


exports.postWithoutLinkAndAttachments = (message) => {
    FB.api(`/${fbGroupID}/feed`, 'POST', { message }, function (response) {
        console.log(response);
    });
}

exports.postWithLinkAndAttachments = (message, publicLink,lastLink,linksLength) => {
    const words = message.split(" ");
    if( ( words[words.length-1] === lastLink || words[words.length-1] === `\n\n\n${lastLink}`) && linksLength === 1) message += " .\n" ;
    FB.api(`/${fbGroupID}/feed?link=${publicLink}`, 'POST', { message }, function (response) {
        console.log(response);
    });
}

