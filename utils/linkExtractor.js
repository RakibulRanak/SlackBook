exports.extract = (message) =>{
    const regex = /<http.[^<]{1,500}>/g;
    const links = message.match(regex);
    let formatedMessage = message;
    if (links) {
        for (let i = 0; i < links.length; i++) {
            const str = links[i];
            links[i] = links[i].replace("<", "");
            links[i] = links[i].replace(">", "");
            message = message.replace(str, links[i]);
        }
        formatedMessage = message;
    }
    return {links,formatedMessage};
}