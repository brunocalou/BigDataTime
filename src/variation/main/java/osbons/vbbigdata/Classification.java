/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package osbons.vbbigdata;

import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;

/**
 *
 * @author Jean-Loïc Mugnier <mugnier at polytech.unice.fr>
 */
public class Classification {

    private JavaPairRDD<String, String> idDateNews; // date, id, cluster, bit of text
    private JavaPairRDD<String, Integer> variation; // date, value
    private JavaPairRDD<String, String> output; // date, id, cluster value

    public JavaPairRDD<String, String> getIdDateNews() {
        return idDateNews;
    }

    public JavaPairRDD<String, Integer> getVariation() {
        return variation;
    }

    public Classification(JavaSparkContext sc, String variationPath, String idDateNewsPath) {
        JavaRDD<String> idNewsRDD = sc.textFile(idDateNewsPath);
        JavaRDD<String> var = sc.textFile(variationPath);
        this.variation = var.mapToPair((String s) -> new Tuple2<>(s.split(",")[0], Integer.valueOf(s.split(",")[1])));
        this.idDateNews = idNewsRDD.mapToPair((String s) -> {
            int index = s.indexOf(",");
            return new Tuple2<>(s.substring(0, index), s.substring(index + 1, s.length()));
        });
    }

    public void saveClassification() {
        this.output.saveAsTextFile("src/resources/classification");
    }

    public JavaPairRDD<String, String> runClassification() {
        JavaPairRDD r = this.variation.join(this.idDateNews); // [date,(variationAtt,iddateAtt)]
        this.output = r;
        return r;
    }

}
