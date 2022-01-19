const encoder = require('./characterEncoder');
exports.extract = async (message) => {

    const boldRegex = /\*.*?\*/g;
    const italicRegex = /\_.*?\_/g;
    const boldItalicRegex = /_\*.[^_]{1,}\*_/g;
    const strikeThroughregex = /~[^~]{1,}~/g;

    const boldItalicArray = message.match(boldItalicRegex);

    if (boldItalicArray) {
        for (let i = 0; i < boldItalicArray.length; i++) {
            if ( process.env.FORMATTER === "true" ) {
                const boldItalicText = encoder.encode(boldItalicArray[i].substring(2, boldItalicArray[i].length - 2), 'bold_italic');
                message = message.replace(boldItalicArray[i], boldItalicText);
            }
            else message = message.replace(boldItalicArray[i],boldItalicArray[i].substring(2, boldItalicArray[i].length - 2));
        }
    }
    const italicArray = message.match(italicRegex);
    if (italicArray) {
        for (let i = 0; i < italicArray.length; i++) {
            if (process.env.FORMATTER === "true") {
                const italicText = encoder.encode(italicArray[i].substring(1, italicArray[i].length - 1), 'italic');
                message = message.replace(italicArray[i], italicText);
            }
            else message = message.replace(italicArray[i],italicArray[i].substring(1, italicArray[i].length - 1))
        }
    }

    const boldArray = message.match(boldRegex);
    if (boldArray) {
        for (let i = 0; i < boldArray.length; i++) {
            if (process.env.FORMATTER === "true") {
                const boldText = encoder.encode(boldArray[i].substring(1, boldArray[i].length - 1), 'bold');
                message = message.replace(boldArray[i], boldText);
            }
            else message = message.replace(boldArray[i],boldArray[i].substring(1, boldArray[i].length - 1));
        }
    }
    const strikeThroughArray = message.match(strikeThroughregex);
    if (strikeThroughArray) {
        for (let i = 0; i < strikeThroughArray.length; i++) {
            const strikeThroughText = encoder.encode(strikeThroughArray[i].substring(1, strikeThroughArray[i].length - 1), 'strikethrough');
            message = message.replace(strikeThroughArray[i], strikeThroughText);
        }
    }

    return message;
}