exports.share = async (files,slackClient,message,slackUserToken) => {
    let publicFileUrlPreview = files[0].permalink_public;
    for (let fileNo = 0; fileNo < files.length; fileNo++) {
        let publicFlleUrlText = files[fileNo].permalink_public;
        if (!files[fileNo].public_url_shared) await slackClient.files.sharedPublicURL({ token: slackUserToken, file: files[fileNo].id })
        message += ("\n" + publicFlleUrlText + "\n");
    }
    return {message,publicFileUrlPreview};
}