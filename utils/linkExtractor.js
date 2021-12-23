exports.extract = (message) =>{
    const regex = /<http.[^<]{1,500}>/g;
    const links = message.match(regex);
    let formatedMessage = message;
    if (links) {
        for (let i = 0; i < links.length; i++) {

            const len = links[i].length;
            const str = links[i];
            const str1 = links[i].substr(1,len/2-1);
            const str2 = links[i].substr(len/2+1,len/2-1);
            if ( str1 === str2) links[i] = str1;
            links[i] = links[i].replace("<", "");
            links[i] = links[i].replace(">", "");
            
            message = message.replace(str, links[i]);
        }
        formatedMessage = message;
    }
    return {links,formatedMessage};
}