var request = require('request');

var getAllNewsUrls = function(query, page, callback) {
	var url = {url: 'http://query.nytimes.com/svc/add/v1/sitesearch.json?q=' + query + '&spotlight=true&facet=true&page=' + page, json: true};
	
	request(url, function (err, res, json) {
		if (err) {
			callback(err);
		} else {
			//Parse the json to get the urls
			var docs = json.response.docs;
			var urls = [];

			for (var key in docs) {
				urls.push(docs[key]["web_url"]);
			}
			callback(err, urls);
		}
	});
};

module.exports = {
	getAllNewsUrls: getAllNewsUrls
};