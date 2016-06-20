var jsdom = require("jsdom");
var runAPI = require('../Util/runAPI');

/**
 * Get the all the news urls
 * @param {string} query - The query to be searched
 * @param {number} page - The page number of the news website to search (min value = 1)
 * @param {function} callback - The function to be called when it has finished
 */
var getAllNewsUrls = function(query, page, callback) {
    // var url = 'http://searchapp.cnn.com/search/query.jsp?page=5&npp=10&start=41&text=' + query + '&type=all&bucket=true&sort=relevance&collection=STORIES&csiID=csi15';
    var url = 'http://searchapp.cnn.com/search/query.jsp?page=' + page + '&npp=10&start=' + ((page - 1) * 10 + 1) + '&text=' + query + '&type=all&bucket=true&sort=relevance&collection=STORIES&csiID=csi21';
    jsdom.env(
        url, ["http://code.jquery.com/jquery.js"],
        function(err, window) {
            var urls = [];
            try {
                var json_str = window.$("#jsCode").text();
                var results = JSON.parse(json_str).results[0];
                results.forEach(function(news) {
                    if (news.url.lastIndexOf('/technology/') > -1 || news.url.lastIndexOf('/investing/') > -1 ||
                        news.url.lastIndexOf('/smallbusiness/') > -1 || news.url.lastIndexOf('/news/') > -1) {
                        urls.push(news.url);
                    } else if (news.url.lastIndexOf('/tech/') === -1) {
                        urls.push('http://edition.cnn.com' + news.url)
                    }
                }.bind(this));

                callback(err, urls);
            } catch (err) {
                callback('Could not retrieve url list', urls);
            }
        }
    );
};

/**
 * Get the content and the data of a url
 * @param {string} url - The news url
 * @param {function} callback - The function to be called when it has finished
 */
var getContent = function(url, callback) {
    /**
     * Callback
     * @param {Error} err - The error
     * @param {content_obj} content - The content object
     */
    jsdom.env(
        url, ["http://code.jquery.com/jquery.js"],
        function(err, window) {
            /**
             * Content object
             * @typedef {object} content_obj
             * @property {string} text - The news text
             * @property {string} date - The date (YYYY-MM-DD)
             */
            try {
                var content = {};
                content.text = '';
                content.date = '';

                if (url.lastIndexOf('edition.cnn.com') > -1) {
                    content.text = window.$(".zn-body__paragraph").text();
                    var date_str = window.$(".update-time").text();
                    var date_array = date_str.split(' '); // e.g. [ 'Updated', '1237', 'GMT', '(2037', 'HKT)', 'February', '17', '2015', '' ]
                    date_str = date_array.slice(date_array.length - 4).join(' ');

                    try {
                        content.date = new Date(date_str).toISOString().substring(0, 10);
                    } catch (e) {
                        err = 'Could not get the Date';
                    }
                } else if (url.lastIndexOf('money.cnn.com') > -1) {
                    content.text = window.$("#storytext p").text();
                    var date_str = window.$(".share-byline-timestamp .cnnDateStamp").text();
                    var date_array = date_str.split(' '); // e.g. [ '', 'September', '18,', '2015:', '11:53', 'AM', 'ET', ''    ]
                    date_str = date_array[1] + ' ' + date_array[2].replace(',', '') + ' ' + date_array[3].replace(':', '');

                    try {
                        content.date = new Date(date_str).toISOString().substring(0, 10);
                    } catch (e) {
                        err = 'Could not get the Date';
                    }
                }

                callback(err, content);
            } catch (err) {
                callback('Could not get the content', {});
            }
        }
    );
};

// getAllNewsUrls('bitcoin', 1, function(err, urls) {
//     console.log(urls);
// });

// getContent('http://money.cnn.com/2015/09/18/investing/bitcoin-investing-etf/index.html', function(err, content) {
//     console.log(content.date);
// });

runAPI(getAllNewsUrls, getContent, 'CNN');

module.exports = {
    getAllNewsUrls: getAllNewsUrls,
    getContent: getContent
};
