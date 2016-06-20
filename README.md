# BigDataTime
[College Project] Big Data project using Spark for the Big Data class at UFRJ

## Dependencies
Install the following dependencies in order to build and run the project
* [Nodejs](https://nodejs.org/en/)

## Tools
### news-finder
This program is used to retrieve news from a few websites and save them as CSV files
* Location: tools/news-finder
* Language: Javascript

## Build
### news-finder tool
```Shell
cd tools/news-finder/
npm install
```

## Run
### news-finder tool
Download all the news from all the available sites
```Shell
cd tools/news-finder/
./run.sh
```
If you can't execute the script, change its permission (on linux)
```Shell
chmod u+x ./run.sh
```

You can download specific sites using the command
```Shell
node index.js -s <site>
```
