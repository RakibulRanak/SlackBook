exports.extract = (message) =>{
    const codeRegex = /`[^`]{1,}`/g;
    const codes = message.match(codeRegex);
    let plainMessage = message;
    if (codes) {
        for (let i = 0; i < codes.length; i++) {
            const str = codes[i];
            codes[i] = codes[i].replace("`", "");
            codes[i] = codes[i].replace("`", "");
            message = message.replace(str, codes[i]);
        }
        plainMessage = message;
    }
    return plainMessage;
}