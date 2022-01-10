const formatter = require('./formatter');
exports.extract = async (message) => {

    const boldRegex = /\*.*?\*/g;
    const italicRegex = /\_.*?\_/g;
    const strikeThroughregex = /~[^~]{1,}~/g;
    const boldArray = message.match(boldRegex);
    const italicArray = message.match(italicRegex);

    if (boldArray) {
        for (let i = 0; i < boldArray.length; i++) {
            const boldText = formatter.convertFormat(boldArray[i].substring(1, boldArray[i].length - 1), 'bold');
            message = message.replace(boldArray[i], boldText);
        }
    }

    if (italicArray) {
        for (let i = 0; i < italicArray.length; i++) {
            const italicText = formatter.convertFormat(italicArray[i].substring(1, italicArray[i].length - 1), 'italic');
            message = message.replace(italicArray[i], italicText);
        }
    }
    const strikeThroughArray = message.match(strikeThroughregex);
    if (strikeThroughArray) {
        for (let i = 0; i < strikeThroughArray.length; i++) {
            const strikeThroughText = formatter.convertFormat(strikeThroughArray[i].substring(1, strikeThroughArray[i].length - 1), 'strikethrough');
            message = message.replace(strikeThroughArray[i], strikeThroughText);
        }
    }


    return message;
}