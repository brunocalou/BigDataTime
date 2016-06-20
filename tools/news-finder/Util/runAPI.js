const chalk = require('chalk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('./config');

module.exports = function(getAllNewsUrls, getContent, siteName) {
    var query = 'bitcoin';
    var page = 1;
    var output_folder = config.outputFolder + siteName;

    function getAllNewsUrlsCallback(err, urls) {
        // console.log(urls);
        if (urls.length === 0) { //empty urls
            console.log(chalk.red("COULD NOT RETRIEVE URL LIST FOR " + siteName.toUpperCase() + ", QUERY = " + query + ", PAGE = " + page));
            throw new Error("FAILED TO RETRIEVE URL LIST");
        }
        urls.forEach(function(url) {
            console.log(chalk.yellow('RETRIEVING ') + url);
            try {
                getContent(url, function(err, content) {
                    if (Object.keys(content).length === 0) { //empty object
                        console.log(chalk.red("COULD NOT RETRIEVE CONTENT OF " + url));
                    } else {
                        if (content.text === undefined || content.text === '') {
                            console.log(chalk.red("COULD NOT RETRIEVE TEXT OF " + url));

                        } else if (content.date === undefined || content.date === '') {
                            console.log(chalk.red("COULD NOT RETRIEVE DATE OF " + url));
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
    }

    //loop function
    function loop() {
        try {
            getAllNewsUrls(query, page, function(err, urls) {
                try {
                    console.log(chalk.yellow(siteName.toUpperCase()) + chalk.yellow(" PAGE ") + page);
                    getAllNewsUrlsCallback(err, urls);
                    page += 1;
                    loop();
                } catch (err) {
                    if (page === 1) {
                        console.log(chalk.red("FAILED TO GET URLS OF " + siteName.toUpperCase()));
                        console.log(err);
                    }
                }
            });
        } catch (err) {
            console.log(chalk.red("AN UNEXPECTED ERROR HAS OCCURRED"));
            console.log(err);
        }
    }

    //make the output folder
    mkdirp.sync(output_folder);

    //start loop
    loop();
};
