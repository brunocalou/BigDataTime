var request = require('request');
var jsdom = require("jsdom");
var runAPI = require('../Util/runAPI');

/**
* Get the all the news urls
* @param {string} query - The query to be searched
* @param {number} page - The page number of the news website to search (min value = 1)
* @param {function} callback - The function to be called when it has finished
*/
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
                	url_array[4] +'-' + //Month
                	url_array[5]; //Day

                callback(err, content);
            } catch (err) {
                callback('Could not get the content', {});
            }
        }
    );
};

runAPI(getAllNewsUrls, getContent);

module.exports = {
    getAllNewsUrls: getAllNewsUrls,
    getContent: getContent
};
