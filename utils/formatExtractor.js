const formatter = require('./formatter');
exports.extract = async (message) => {

    const boldRegex = /\*.*?\*/g;
    const italicRegex = /\_.*?\_/g;
    const boldItalicRegex = /_\*.[^_]{1,}\*_/g;
    const strikeThroughregex = /~[^~]{1,}~/g;

    const boldItalicArray = message.match(boldItalicRegex);

    if (boldItalicArray) {
        for (let i = 0; i < boldItalicArray.length; i++) {
            const boldItalicText = formatter.convertFormat(boldItalicArray[i].substring(2, boldItalicArray[i].length - 2), 'bold_italic');
            message = message.replace(boldItalicArray[i], boldItalicText);
        }
    }
    console.log("after bold_italic", message)

    const italicArray = message.match(italicRegex);
    if (italicArray) {
        for (let i = 0; i < italicArray.length; i++) {
            const italicText = formatter.convertFormat(italicArray[i].substring(1, italicArray[i].length - 1), 'italic');
            message = message.replace(italicArray[i], italicText);
        }
    }
    console.log("after itlaic", message)

    const boldArray = message.match(boldRegex);


    if (boldArray) {
        for (let i = 0; i < boldArray.length; i++) {
            const boldText = formatter.convertFormat(boldArray[i].substring(1, boldArray[i].length - 1), 'bold');
            message = message.replace(boldArray[i], boldText);
        }
    }
    console.log("after bold", message)

    const strikeThroughArray = message.match(strikeThroughregex);

    if (strikeThroughArray) {
        for (let i = 0; i < strikeThroughArray.length; i++) {

            const strikeThroughText = formatter.convertFormat(strikeThroughArray[i].substring(1, strikeThroughArray[i].length - 1), 'strikethrough');
            message = message.replace(strikeThroughArray[i], strikeThroughText);
        }
    }
    console.log("after strikethrough", message)

    return message;
}