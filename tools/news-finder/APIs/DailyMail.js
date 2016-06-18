var jsdom = require("jsdom");
var runAPI = require('../Util/runAPI');

/**
* Get the all the news urls
* @param {string} query - The query to be searched
* @param {number} page - The page number of the news website to search (min value = 1)
* @param {function} callback - The function to be called when it has finished
*/
var getAllNewsUrls = function(query, page, callback) {
    var url = 'http://www.dailymail.co.uk/home/search.html?offset=' + 50 * (page - 1) + '&size=50&sel=site&searchPhrase=' + query + '&sort=recent&type=article&type=video&days=all';

    jsdom.env(
        url, ["http://code.jquery.com/jquery.js"],
        function(err, window) {
            var urls = [];
            var link_tags = window.$(".sch-results .sch-res-title a").each(function() {
                urls.push(this.href);
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
            try {
                var content = {};
                content.text = '';
                content.date = '';

                content.text = window.$(".article-text p:not([class])").text();

                var date_str = window.$(".article-text .article-timestamp-published").text();
                var date_array = date_str.split(' '); // e.g. [ '\n', '', 'Published:\n', '', '22:00', 'GMT,', '6', 'May', '2016\n' ]
                date_str = date_array.slice(date_array.length - 3).join(' ').replace('\n', '');

                try {
                    content.date = new Date(date_str).toISOString().substring(0, 10);
                } catch (err) {
                    err = 'Could not get the Date';
                }

                callback(err, content);
            } catch (err) {
                callback('Could not get the content', {});
            }
        }
    );
};

// getAllNewsUrls('bitcoin', 1, function(err, urls){
//     console.log(urls);
// });

// getContent('http://www.dailymail.co.uk/wires/reuters/article-3577915/Digital-currency-firm-founder-gets-20-years-U-S-prison.html', function(err, content) {
//     console.log(content.date);
// });

runAPI(getAllNewsUrls, getContent);

module.exports = {
    getAllNewsUrls: getAllNewsUrls,
    getContent: getContent
};
