const chalk = require('chalk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('./config');

module.exports = function(getAllNewsUrls, getContent, siteName) {
    var query = 'bitcoin';
    var page = 1;
    var output_folder = config.outputFolder + siteName;

    mkdirp.sync(output_folder);

    try {
        getAllNewsUrls(query, page, function(err, urls) {
            // console.log(urls);
            if (urls.length === 0) { //empty urls
                console.log(chalk.red("COULD NOT RETRIEVE URL LIST FOR QUERY = " + query + ", PAGE = " + page));
            }
            urls.forEach(function(url) {
                console.log(chalk.yellow('RETRIEVING ') + url);
                try {
                    getContent(url, function(err, content) {
                        if (Object.keys(content).length === 0) { //empty object
                            console.log(chalk.red("COULD NOT RETRIEVE CONTENT FOR " + url));
                        } else {
                            if (content.text === undefined || content.text === '') {
                                console.log(chalk.red("COULD NOT RETRIEVE TEXT FOR " + url));

                            } else if (content.date === undefined || content.date === '') {
                                console.log(chalk.red("COULD NOT RETRIEVE DATE FOR " + url));
                            } else {
                                // Success. Let's save it
                                if (content.text[0] === ' ') {
                                    content.text = content.text.replace(' ', '');
                                }
                                fs.writeFile(output_folder + '/' + query + '-' + page + '-' + url.replace(':', '').split('.').join('-').split('/').join('_'),
                                    url + '\n' + content.date + '\n' + content.text, (err) => {
                                        if (err) {
                                            console.log(chalk.red("FAILED TO SAVE ") + url);
                                            console.log(err);
                                        } else {
                                            console.log(chalk.green("SAVED ") + url);
                                        }
                                    });
                                // console.log('\n' + url);
                                // console.log(content);
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
