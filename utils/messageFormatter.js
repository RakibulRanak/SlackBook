const encoder = require('./characterEncoder')
const linkExtractor = require('./linkExtractor');
const mentionExtractor = require('./mentionExtractor');
const formatExtractor = require('./formatExtractor');
const mailExtractor = require('./mailExtractor');
const textBlockFormatter = process.env.TEXT_BLOCK_FORMATTER;

exports.format = async (message, username) => {

    message = message.replace("#fb ", "");
    message = message.replace(" #fb", "");
    message = message.replace("#fb", "");
    message = await mailExtractor.extract(message);
    message = await mentionExtractor.extract(message);
    let { links, formattedMessage, lastLink, linksLength } = await linkExtractor.extract(message);
    message = formattedMessage;
    message = await formatExtractor.extract(message);

    codeBlockRegex = /```[^```]{1,}```/g;
    const codeBlocks = message.match(codeBlockRegex);
    if (codeBlocks) {
        for (let i = 0; i < codeBlocks.length; i++) {
            const str = codeBlocks[i];
            codeBlocks[i] = codeBlocks[i].replace(codeBlocks[i], codeBlocks[i].substring(3, codeBlocks[i].length - 3));
            if (textBlockFormatter === "true")
                codeBlocks[i] = "***\n" + codeBlocks[i] + "\n***";
            message = message.replace(str, codeBlocks[i]);
        }
    }
    const codeRegex = /`[^`]{0,}`/g;
    const codes = message.match(codeRegex);
    if (codes) {
        for (let i = 0; i < codes.length; i++) {
            const str = codes[i];
            codes[i] = codes[i].replace(codes[i], codes[i].substring(1, codes[i].length - 1));
            if (textBlockFormatter === "true" && codes[i])
                codes[i] = ">   " + codes[i];
            message = message.replace(str, codes[i]);
        }
    }

    const blockquoteRegex = /&gt;[^&gt;]{0,}/g;
    const blockquote = message.match(blockquoteRegex);
    if (blockquote) {
        for (let i = 0; i < blockquote.length; i++) {
            const str = blockquote[i];
            blockquote[i] = blockquote[i].replace(blockquote[i], blockquote[i].substring(4, blockquote[i].length));
            blockquote[i] = blockquote[i].trimStart();
            if (textBlockFormatter === "true" && blockquote[i])
                blockquote[i] = "|  " + blockquote[i];
            message = message.replace(str, blockquote[i]);
        }
    }

    if (message.match("&amp")) for (let i = 0; i < message.length; i++) {
        if (textBlockFormatter === "true")
            message = message.replace("&amp;", "&");
        else
            message = message.replace("&amp;", "");
    }

    formattedUsername = encoder.encode(username, 'bold');
    message = formattedUsername + " shared via slack " + `\n\n${message}`;

    return { links, formattedMessage: message, lastLink, linksLength };
}