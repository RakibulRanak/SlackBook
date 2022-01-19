const encoder = require('./characterEncoder')
const linkExtractor = require('./linkExtractor');
const mentionExtractor = require('./mentionExtractor');
const formatExtractor = require('./formatExtractor');
const mailExtractor = require('./mailExtractor');

exports.format = async (message, username) => {

    message = message.replace("#fbpost ", "");
    message = message.replace(" #fbpost", "");
    message = message.replace("#fbpost", "");
    message = await mailExtractor.extract(message);
    message = await mentionExtractor.extract(message);
    let { links, formattedMessage,lastLink,linksLength} = await linkExtractor.extract(message);
    message = formattedMessage;
    message = await formatExtractor.extract(message);

    codeBlockRegex = /```[^```]{1,}```/g;
    const codeBlocks = message.match(codeBlockRegex);
    if (codeBlocks) {
        for (let i = 0; i < codeBlocks.length; i++) {
            const str = codeBlocks[i];
            codeBlocks[i] = "***\n" + codeBlocks[i].replace(codeBlocks[i], codeBlocks[i].substring(3, codeBlocks[i].length - 3)) + "\n***";
            message = message.replace(str, codeBlocks[i]);
        }
    }
    const codeRegex = /`[^`]{1,}`/g;
    const codes = message.match(codeRegex);
    if (codes) {
        for (let i = 0; i < codes.length; i++) {
            const str = codes[i];
            codes[i] = ">   " + codes[i].replace(codes[i], codes[i].substring(1, codes[i].length - 1));
            message = message.replace(str, codes[i]);
        }
    }


    if (message.match("&gt")) for (let i = 0; i < message.length; i++) message = message.replace("&gt;", "|  ");
    if (message.match("&amp")) for (let i = 0; i < message.length; i++) message = message.replace("&amp;", "&");
    // message = await formatExtractor.extract(message);
    formattedUsername = encoder.encode(username, 'bold');
    message = formattedUsername + " shared via slack " + `\n\n${message}`;

    return { links, formattedMessage: message ,lastLink,linksLength};
}