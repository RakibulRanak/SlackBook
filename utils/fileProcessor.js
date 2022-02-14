exports.process = async (files, slackClient, message, slackUserToken) => {
    let publicFileUrlPreview = files[0].permalink_public;
    let messageWithAttachments = message;
    let lastLink;
    for (let fileNo = 0; fileNo < files.length; fileNo++) {
        let publicFlleUrlText = files[fileNo].permalink_public;
        try {
            if (!files[fileNo].public_url_shared) await slackClient.files.sharedPublicURL({ token: slackUserToken, file: files[fileNo].id })
        } 
        catch(error) {
            console.log("Slack error " + error.message)
        }
        messageWithAttachments += ("\n" + publicFlleUrlText);
        if (fileNo != files.length - 1) messageWithAttachments += "\n";
        lastLink = publicFlleUrlText;
    }
    return { messageWithAttachments, publicFileUrlPreview, lastLink, linksLength: files.length };
}