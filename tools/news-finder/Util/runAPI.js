const chalk = require('chalk');

module.exports = function(getAllNewsUrls, getContent) {
	var query = 'bitcoin';
	var page = 1;

	try {
	    getAllNewsUrls(query, page, function(err, urls) {
	        console.log(urls);
	        if (urls.length === 0) { //empty urls
	        	console.log(chalk.red("COULD NOT RETRIEVE URL LIST FOR QUERY = " + query + ", PAGE = " + page));
	        }
	        urls.forEach(function(url) {
	        	try {
		            getContent(url, function(err, content) {
		                if (Object.keys(content).length === 0) { //empty object
		                	console.log(chalk.red("COULD NOT RETRIEVE CONTENT FOR URL = " + url));
		                } else {
		                	if (content.text === undefined || content.text === '') {
		                		console.log(chalk.red("COULD NOT RETRIEVE TEXT FOR URL = " + url));

		                	} else if (content.date === undefined || content.date === '') {
		                		console.log(chalk.red("COULD NOT RETRIEVE DATE FOR URL = " + url));
		                	} else {
		                		console.log('\n' + url);
		                		console.log(content);
		                	}
		                }
		            });
	        	} catch (err) {
	        		console.log(chalk.red("FAILED TO GET CONTENT OF " + url));
	        		console.log(err);
	        	}
	        });
	    }.bind(this));
	} catch (err) {
		console.log(chalk.red("FAILED TO GET URLS"));
		console.log(err);
	}
};
