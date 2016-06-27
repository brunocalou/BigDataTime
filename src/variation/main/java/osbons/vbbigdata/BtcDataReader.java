package osbons.vbbigdata;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import org.apache.spark.api.java.function.Function;

/**
 *BtcDataReader is the class responsible for reading the csv file about the valuation of the btc.
 * It is also responsible for create the variation RDD with the variation of the btc from day n, to day n+1
 *
 * @author Jean-Loïc Mugnier <mugnier at polytech.unice.fr>
 */
public class BtcDataReader {

    /**
     * int[]data array with btc-> dollar period
     *
     */
    private JavaPairRDD<String, String> data; // <date(ano-mes-dia),c>
    private JavaPairRDD<String, Float> variation;
    private final JavaSparkContext sc;

    public BtcDataReader(String name, String mode) {
        SparkConf conf;
        conf = new SparkConf().setAppName(name).setMaster(mode);
        this.sc = new JavaSparkContext(conf);
//        SQLContext sqlContext = new org.apache.spark.sql.SQLContext(this.sc);
    }

    /**
     * Import the csv file to our data pairRDD
     * @param path, path to the csv file
     */
    public void importData(String path) {
        JavaRDD<String> rd = this.sc.textFile(path);
        rd = filter_r_data(rd, rd.first());
        this.data = rd.mapToPair((String s) -> new Tuple2<>(s.split(",")[0], s.split(",")[1]));
    }

    /**
     * save csv file associated to the variation rdd
     */
    public void saveVariation() {
        this.variation.saveAsTextFile("src/resources/btc_variation.csv");
    }

    /**
     * Calculates the variation and creates the rdd associated to the values. 
     */
    public void calculateVariation() {

        List<Tuple2<String, String>> d = data.collect(); //handle date - remove fisrt
        List<Tuple2<String, Float>> lvar = new ArrayList<>();
        Iterator<Tuple2<String, String>> it = d.iterator();
        Float first = Float.valueOf(it.next()._2()); // já removeu a primeira data
        while (it.hasNext()) {
            Tuple2<String, String> row = it.next();
            String date = row._1();
            Float value = Float.valueOf(row._2());
            Float var = value - first;
            Tuple2<String, Float> t = new Tuple2<>(date, var);
            lvar.add(t);
            first = value;
        }
        this.variation = sc.parallelizePairs(lvar);
    }


    public JavaPairRDD<String, String> getData() {
        return this.data;
    }

    /**
     * RDD filter by removing the string s from the RDD
     * @param data, RDD
     * @param s, String to remove from the RDD
     * @return, RDD without the s value
     */
    private JavaRDD<String> filter_r_data(JavaRDD<String> data, String s) {
        return data.filter((String str) -> !str.equals(s));
    }

    public JavaPairRDD<String, Float> getVariation() {
        return this.variation;
    }

}
