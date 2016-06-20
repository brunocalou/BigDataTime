var jsdom = require("jsdom");
var runAPI = require('../Util/runAPI');

/**
* Get the all the news urls
* @param {string} query - The query to be searched
* @param {number} page - The page number of the news website to search (min value = 1)
* @param {function} callback - The function to be called when it has finished
*/
var getAllNewsUrls = function(query, page, callback) {
    var url = 'http://www.usatoday.com/search/' + query + '/' + page + '/?ajax=true';

    jsdom.env(
        url, ["http://code.jquery.com/jquery.js"],
        function(err, window) {
            var urls = [];
            var link_tags = window.$(".search-result-item a").each(function() {
                if (this.href.lastIndexOf('/story/') > -1) {
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
            try {
                var content = {};
                content.text = '';
                content.date = '';
                content.text = window.$(".story [itemprop='articleBody'] p").text();
                
                var date_str = window.$(".asset-metabar-time").text();
                var date_array = date_str.split(' '); //[time, a.m/p.m, EDT, month, day, year]
                date_str = date_array.slice(date_array.length - 3).join(' ');

                try {
                    content.date = new Date(date_str).toISOString().substring(0, 10);
                } catch (e) {
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

// getContent('http://www.usatoday.com/story/money/business/2015/12/09/australia-police-raid/77025872/', function(err, content) {
//     console.log(content);
// });

runAPI(getAllNewsUrls, getContent);

module.exports = {
    getAllNewsUrls: getAllNewsUrls,
    getContent: getContent
};
