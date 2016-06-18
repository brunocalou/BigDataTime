var request = require('request');
var jsdom = require("jsdom");
var runAPI = require('../Util/runAPI');

/**
* Get the all the news urls
* @param {string} query - The query to be searched
* @param {number} page - The page number of the news website to search
* @param {function} callback - The function to be called when it has finished
*/
var getAllNewsUrls = function(query, page, callback) {
    var url = 'http://www.bbc.co.uk/search?q=' + query + '&page=' + page + '&filter=news';

    jsdom.env(
        url, ["http://code.jquery.com/jquery.js"],
        function(err, window) {
            var urls = [];
            var link_tags = window.$(".results h1 a").each(function() {
                if (this.href.lastIndexOf('/technology-') > -1 ||
                    this.href.lastIndexOf('/magazine-') > -1) {
                    urls.push(this.href);
                }
            });
            callback(err, urls);
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
            var content = {};
            content.text = window.$(".story-body .story-body__inner p").text();
            //TODO: Get the date
            var date_str = window.$(".mini-info-list__item .date").text();
            try {
                content.date = new Date(date_str).toISOString().substring(0, 10);
            } catch (err) {
                content = {};
                err = 'Could not get the Date';
            }

            callback(err, content);
        }
    );
};

// getAllNewsUrls('bitcoin', 1, function(err, urls){
//     console.log(urls);
// });

// getContent('http://www.bbc.com/news/technology-22110345', function(err, content) {
//     console.log(content.date);
// });

runAPI(getAllNewsUrls, getContent);

module.exports = {
    getAllNewsUrls: getAllNewsUrls,
    getContent: getContent
};
