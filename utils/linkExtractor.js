exports.extract = (message) =>{
    const regex = /<http.{1,500}>/g;
    const link = message.match(regex);
    let formatedMessage = message;
    if (link) {
        for (let i = 0; i < link.length; i++) {
            const str = link[i];
            link[i] = link[i].replace("<", "");
            link[i] = link[i].replace(">", "");
            message = message.replace(str, link[i]);
        }
        formatedMessage = message;
    }
    return {link,formatedMessage};
}