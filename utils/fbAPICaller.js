const FB = require("fb");
FB.setAccessToken(process.env.FB_ACCESS_TOKEN);
const groupID = process.env.GROUP_ID;


exports.postWithoutLinkAndAttachments = (message) => {
    FB.api(`/${groupID}/feed`, 'POST', { message }, function (response) {
        console.log(response);
    });
}

exports.postWithLink = (message, publicLink) => {
    FB.api(`/${groupID}/feed?link=${publicLink}`, 'POST', { message }, function (response) {
        console.log(response);
    });
}

exports.postWithImage = (message, imageLinkWithExtension) => {
    FB.api(`/${groupID}/photos?url=${imageLinkWithExtension}`, 'POST', { message }, function (response) {
        console.log(response);
    });
}
exports.postWithAttachments = (message, publicLink) => {
    FB.api(`/${groupID}/feed?link=${publicLink}`, 'POST', { message }, function (response) {
        console.log(response);
    });
}

