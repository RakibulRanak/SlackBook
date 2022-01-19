exports.extract = (message) => {
    const mailExtractorRegex = /<mailto:.[^<]{1,5000}>/g;
    const mailLinks = message.match(mailExtractorRegex);
    if (mailLinks) {
        for (let i = 0; i < mailLinks.length; i++) {
            const mailTo = mailLinks[i].split("|", 1);
            const email = mailTo[0].substring(8);
            message = message.replace(mailLinks[i], email)
        }
    }
    return message;
}