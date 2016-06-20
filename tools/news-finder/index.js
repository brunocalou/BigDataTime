var requireDir = require('require-dir');
var APIs = requireDir('./APIs');
var runAPI = require('./Util/runAPI');

var choices = [];
var choiceToName = {}; // e.g. {'bbc': 'BBC'}

for (var key in APIs) {
	var lower_case_key = key.toLowerCase();
	choices.push(lower_case_key);
	choiceToName[lower_case_key] = key;
}

var argv = require('yargs').usage('Usage: $0 <command> [options]')
	.example('$0', 'Download all news from all the available sites')
	.example('$0 --bbc', 'Download all news from BBC')
	.option('s', {
		alias: 'source',
		choices: choices
	})
	.help('h')
	.alias('h', 'help')
	.argv;

//Run
var APIName = choiceToName[argv.s];
var API = APIs[APIName];

runAPI(API.getAllNewsUrls, API.getContent, APIName);
