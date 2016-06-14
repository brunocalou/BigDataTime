var request = require('request');
var requireDir = require('require-dir');
var APIs = requireDir('./APIs');

console.log(APIs);

for (var keyname in APIs) {
	var api = APIs[keyname];
	api.getAllNewsUrls('bitcoin', 1, function (err, urls) {
		console.log(urls);
	});
};