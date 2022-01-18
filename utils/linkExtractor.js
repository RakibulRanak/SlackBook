const encoder = require('./characterEncoder')

exports.extract = (message) => {
    const linkExtractorRegex = /<http.[^<]{1,5000}>/g;
    const linkTextExtractorRegex = /.[^|]{1,5000}/g;
    const links = message.match(linkExtractorRegex);
    let formattedMessage = message;
    if (links) {
        for (let i = 0; i < links.length; i++) {
            const unformattedLink = links[i];
            let ind = message.indexOf(links[i]);
            links[i] = links[i].replace(links[i], links[i].substring(1, links[i].length - 1));
            const linkText = links[i].match(linkTextExtractorRegex);
            if (linkText[1]) {
                linkText[1] = linkText[1].replace(linkText[1], linkText[1].substring(1));
                const linklen = Math.min(linkText[0].length, 10);
                const linkTextlen = Math.min(linkText[1].length, 10);
                if (linkText[1].substring(0, linkTextlen) != linkText[0].substring(0, linklen)) {
                    message = message.substring(0, ind) + encoder.encode(linkText[1]) + " : " + message.substring(ind);
                }
                links[i] = linkText[0];
            }
            message = message.replace(unformattedLink, links[i]);
        }
        formattedMessage = message;
    }
    return { links, formattedMessage };
}