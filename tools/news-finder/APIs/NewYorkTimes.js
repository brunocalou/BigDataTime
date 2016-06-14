var request = require('request');
var jsdom = require("jsdom");

var getAllNewsUrls = function(query, page, callback) {
    var url = { url: 'http://query.nytimes.com/svc/add/v1/sitesearch.json?q=' + query + '&spotlight=true&facet=true&page=' + page, json: true };

    request(url, function(err, res, json) {
        var urls = [];

        if (!err && res.statusCode == 200) {
            //Parse the json to get the urls
            var docs = json.response.docs;

            for (var key in docs) {
                urls.push(docs[key]["web_url"]);
            }
        }
        callback(err, urls);
    });
};

//TODO: Get date from news
var getContent = function(url, callback) {
    jsdom.env(
        "http://www.nytimes.com/2016/04/07/business/dealbook/ripple-aims-to-put-every-transaction-on-one-ledger.html", ["http://code.jquery.com/jquery.js"],
        function(err, window) {
            var content = window.$("p.story-body-text").text();

            callback(err, content);
        }
    );
};




module.exports = {
    getAllNewsUrls: getAllNewsUrls,
    getContent: getContent
};
