const formatter = require('./formatter');
exports.extract = async (message) => {
    const regex = /\_.*?\_/g;
    const italic = message.match(regex);
    if (italic) {
        for (let i = 0; i < italic.length; i++) {
            console.log(italic[i].substring(1,italic[i].length-1));
            const italicText = formatter.convertFormat(italic[i].substring(1,italic[i].length-1),'italic');
            message = message.replace(italic[i],italicText);
        }
    }
    return message;
}