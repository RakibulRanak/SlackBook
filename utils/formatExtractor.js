const encoder = require('./characterEncoder');
exports.extract = async (message) => {

    const boldRegex = /\*.*?\*/g;
    const italicRegex = /\_.*?\_/g;
    const boldItalicRegex = /_\*.[^_]{1,}\*_/g;
    const strikeThroughregex = /~[^~]{1,}~/g;

    const boldItalicArray = message.match(boldItalicRegex);

    if (boldItalicArray) {
        for (let i = 0; i < boldItalicArray.length; i++) {
            let sub_Message = boldItalicArray[i].substring(2, boldItalicArray[i].length - 2);
            if (process.env.MARKUP === "true")
                sub_Message = encoder.encode(sub_Message, 'bold_italic');
            message = message.replace(boldItalicArray[i], sub_Message);
        }
    }
    const italicArray = message.match(italicRegex);
    if (italicArray) {
        for (let i = 0; i < italicArray.length; i++) {
            let sub_Message = italicArray[i].substring(1, italicArray[i].length - 1);
            if (process.env.MARKUP === "true")
                sub_Message = encoder.encode(sub_Message, 'italic');
            message = message.replace(italicArray[i], sub_Message)
        }
    }

    const boldArray = message.match(boldRegex);
    if (boldArray) {
        for (let i = 0; i < boldArray.length; i++) {
            let sub_Message = boldArray[i].substring(1, boldArray[i].length - 1)
            if (process.env.MARKUP === "true")
                sub_Message = encoder.encode(sub_Message, 'bold');
            message = message.replace(boldArray[i], sub_Message);

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