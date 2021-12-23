const Crawler = require("crawler");

exports.crawl = (urlsite) => {
    return new Promise((resolve, reject) => {
        var c = new Crawler({
            callback: function (error, res, done) {
                const image = res.$('img');
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    url = image[0].attribs.src
                    resolve(url);
                }
                done();
            }
        });
        c.queue(urlsite);
    })
};
