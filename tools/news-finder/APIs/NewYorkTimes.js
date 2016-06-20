var jsdom = require("jsdom");
var runAPI = require('../Util/runAPI');
var http = require('http');

/**
 * Get the all the news urls
 * @param {string} query - The query to be searched
 * @param {number} page - The page number of the news website to search (min value = 1)
 * @param {function} callback - The function to be called when it has finished
 */
var getAllNewsUrls = function(query, page, callback) {
    var url = 'http://query.nytimes.com/svc/add/v1/sitesearch.json?q=' + query + '&spotlight=true&facet=true&page=' + page;
    var urls = []; //retrieved urls

    http.get(url, function(response) {
        var final_data = "";

        response.on('data', function(data) {
            final_data += data.toString();
        });

        response.on('end', function() {
            try {
                var docs = JSON.parse(final_data).response.docs;
                for (var key in docs) {
                    urls.push(docs[key]["web_url"]);
                }
                callback(null, urls);
            } catch (e) {
                callback('Could not retrieve url list', urls);
            }
        });

        response.on('error', function (e) {
            callback(e, urls);
        })
    });
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
                content.text = window.$("p.story-body-text").text();

                var url_array = url.split('/');
                content.date =
                    url_array[3] + '-' + //Year
                    url_array[4] + '-' + //Month
                    url_array[5]; //Day

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

// getContent('http://www.nytimes.com/2013/12/27/opinion/answers-to-the-year-in-questions.html', function(err, content) {
//     console.log(content.date);
// });

runAPI(getAllNewsUrls, getContent, 'NewYorkTimes');

module.exports = {
    getAllNewsUrls: getAllNewsUrls,
    getContent: getContent
};
