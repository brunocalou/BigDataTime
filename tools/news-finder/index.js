var requireDir = require('require-dir');
var APIs = requireDir('./APIs');

console.log(APIs);

for (var keyname in APIs) {
	var api = APIs[keyname];
	api.getAllNewsUrls('bitcoin', 50, function (err, urls) {
		console.log(urls);

		urls.forEach(function (url) {
			api.getContent(url, function (err, content) {
				console.log('\n' + url + '\n');
				console.log(content);
			});
		});
	});
};