exports.extract = (message) =>{
    const regex = /<http.[^<]{1,500}>/g;
    const linkRegex =  /.[^|]{1,500}/g;
    const links = message.match(regex);
    let formatedMessage = message;
    if (links) {
        for (let i = 0; i < links.length; i++) {
            const unformattedLink = links[i];
            let ind = message.indexOf(links[i]);
            links[i] = links[i].replace(links[i],links[i].substring(1,links[i].length-1));
            const linkText = links[i].match(linkRegex);
            if(linkText[1]){
                linkText[1] = linkText[1].replace("|", "");
                if(linkText[0] != linkText[1]){
                    message = message.substring(0, ind) + linkText[1] +": " + message.substring(ind);
                    linkText[0] = linkText[0] + "\n";
                }
                links[i] = linkText[0];
            }
            message = message.replace(unformattedLink, links[i]);
        }
        formatedMessage = message;
    }
    return {links,formatedMessage};
}