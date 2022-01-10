const { convertFormat } = require("./formatter");

exports.extract = (message) => {

    codeBlockRegex = /```[^```]{1,}```/g;
    const codeBlocks = message.match(codeBlockRegex);
    if (codeBlocks) {
        for (let i = 0; i < codeBlocks.length; i++) {
            const str = codeBlocks[i];
            codeBlocks[i] = codeBlocks[i].replace(codeBlocks[i],codeBlocks[i].substring(3,codeBlocks[i].length-3));
            message = message.replace(str, codeBlocks[i]);
        }
    } 

    const codeRegex = /`[^`]{1,}`/g;
    const codes = message.match(codeRegex);
    if (codes) {
        for (let i = 0; i < codes.length; i++) {
            const str = codes[i];
            codes[i] = codes[i].replace(codes[i],codes[i].substring(1,codes[i].length-1));
            message = message.replace(str, codes[i]);
        }
    }
    plainMessage = message;
    return plainMessage;
}