#!/usr/bin/nodejs

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
	.example('$0 -s bbc', 'Download all news from BBC using the default keyword')
	.example('$0 -s bbc -k blockchain', 'Download all news from BBC using the keyword blockchain')
	.example('$0 -s bbc -f 3 -t 8', 'Download all news from BBC from page 3 to 8 (inclusive) using the default keyword')
	.option('s', {
		alias: 'source',
		choices: choices,
		describe: 'the site to do the search',
		demand: true
	})
	.option('k', {
		alias: 'keyword',
		describe: 'the keywords to search',
		default: 'bitcoin'
	})
	.option('f', {
		alias: 'from',
		describe: 'the first page to search',
		default: '1'
	})
	.option('t', {
		alias: 'to',
		describe: 'the last page to search'
	})
	.help('h')
	.alias('h', 'help')
	.argv;

//Run
var APIName = choiceToName[argv.s];
var API = APIs[APIName];

runAPI(API.getAllNewsUrls, API.getContent, APIName, argv.k, parseInt(argv.f), parseInt(argv.t));
