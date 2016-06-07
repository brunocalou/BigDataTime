var request = require('request');
var requireDir = require('require-dir');
var APIs = requireDir('./APIs');

console.log(APIs);

for (var keyname in APIs) {
	var api = APIs[keyname];

	request({url: api.getAllUrl('bitcoin', 1), json: true}, function(err, res, json) {
	  if (err) {
	    throw err;
	  }
	  console.log(json);
	});
};