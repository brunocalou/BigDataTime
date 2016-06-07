var getAllUrl = function(query, page) {
	return 'http://query.nytimes.com/svc/add/v1/sitesearch.json?q=' + query + '&spotlight=true&facet=true&page=' + page;
};

module.exports = {
	getAllUrl: getAllUrl
};