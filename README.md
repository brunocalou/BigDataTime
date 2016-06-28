# BigDataTime
[College Project] Big Data project using Spark for the Big Data class at UFRJ

## Dependencies
Install the following dependencies in order to build and run the project
* [Nodejs](https://nodejs.org/en/)

## Project
### SOM
Self-organizing Map
* Location: src/som
* Language: Scala

### BTC Variation Calculator with DataFrame
This programs reads the Bitcoin valuation csv file and calculates the variation from a day to another. It also implements DataFrame, so we can easily get the variation of the currency by calling the method getVariation() by passing the date as a parameter.
* Location: src/variation
* Language: Java

## Tools
### news-finder
This program is used to retrieve news from a few websites and save them on disk
* Location: tools/news-finder
* Language: Javascript

### bitcoin-market-price-downloader
This program is used to retrieve the bitcoin price history and save it as a CSV file
* Location: tools/bitcoin-market-price-downloader
* Language: Javascript



## Build
### SOM
```Shell
cd src/som/
sbt package
```

### BTC Variation Calculator with DataFrame
```Shell
cd src/variation/
mvn package
```
Creating the jar application
use maven to create a jar:
add this to to your pom.xml file:

            <plugin>
                <artifactId>maven-assembly-plugin</artifactId>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>fully.qualified.MainClass</mainClass>
                        </manifest>
                    </archive>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                </configuration>
            </plugin>
and call:
```Shell
cd src/variation
mvn clean compile assembly:single
```

### news-finder tool
```Shell
cd tools/news-finder/
npm install
```

### bitcoin-market-price-downloader
```Shell
cd tools/bitcoin-market-price-downloader/
npm install
```



## Run
### SOM
```Shell
cd src/som/
<your-spark-folder>/bin/spark-submit target/scala<version>/som_project_<version>.jar
```
### BTC Variation Calculator with DataFrame
```Shell
cd src/variation
<your-spark-folder>/bin/spark-submit VBBigData-1.0-SNAPSHOT.jar variation "date(yyyy-mm-dd)"
```

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
Download specific sites using the command
```Shell
node index.js -s <site>
```
You can also choose the keyword, the initial and final pages
```Shell
node index.js -s <site> -k <keyword> -f <from-page> -t <to-page>
```
Need help? Use the -h parameter
```Shell
node index.js -h
```

### bitcoin-market-price-downloader
Just run it using
```Shell
cd tools/bitcoin-market-price-downloader/
node index.js
```
