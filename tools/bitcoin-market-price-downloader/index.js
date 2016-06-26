#!/usr/bin/nodejs

const chalk = require('chalk');
const http = require('http');
const config = require('./Util/config');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function today() {
	function formatNumber(number) {
		if (number < 10) {
			number =  '0' + number;
		} else {
			number = '' + number;
		}
		return number;
	}
	var dateObj = new Date();
	var month = formatNumber(dateObj.getUTCMonth() + 1); //months from 1-12
	var day = formatNumber(dateObj.getUTCDate());
	var year = dateObj.getUTCFullYear();

	return year + "-" + month + "-" + day;
}

const url = 'http://api.coindesk.com/v1/bpi/historical/close.csv?start=2010-07-18&end=' + today() + '&index=USD';
const output_file_path = path.join(config.outputFolder, config.name);

mkdirp.sync(config.outputFolder);

var request = http.get(url, function(response) {
    var final_data = "";

    response.on('data', function(data) {
        final_data += data.toString();
    });

    response.on('end', function() {
        fs.writeFile(
            output_file_path, //destination
            final_data, //content
            (err) => { //callback
                if (err) {
                    console.log(chalk.red("FAILED TO SAVE DATA"));
                    console.log(err);
                } else {
                    console.log(chalk.green("SAVED DATA ON ") + output_file_path);
                }
            });
    });

});

request.on('error', function(e) {
    console.log(chalk.red("FAILED TO RETRIEVE DATA FROM THE SERVER"));
    console.log(e);
});
