#!/usr/bin/nodejs

const chalk = require('chalk');
const https = require('https');
const config = require('./Util/config');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const url = 'https://blockchain.info/pt/charts/market-price?showDataPoints=false&timespan=all&show_header=true&daysAverageString=1&scale=0&format=csv&address=';
const output_file_path = path.join(config.outputFolder, config.name);

mkdirp.sync(config.outputFolder);

var request = https.get(url, function(response) {
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
