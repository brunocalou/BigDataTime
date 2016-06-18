module.exports = function(getAllNewsUrls, getContent) {
    getAllNewsUrls('bitcoin', 1, function(err, urls) {
        // console.log(urls);

        urls.forEach(function(url) {
            getContent(url, function(err, content) {
                console.log('\n' + url);
                console.log(content.date);
            });
        });
    });
};
