const formatter = require('./formatter');
exports.extract = async (message) => {
    const regex = /\*.*?\*/g;
    const bold = message.match(regex);
    if (bold) {
        for (let i = 0; i < bold.length; i++) {
            console.log(bold[i].substring(1,bold[i].length-1));
            const boldText = formatter.convertFormat(bold[i].substring(1,bold[i].length-1),'bold');
            message = message.replace(bold[i],boldText);
        }
    }
    return message;
}