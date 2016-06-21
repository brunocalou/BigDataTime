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
 *
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

    public void importData(String path) {
        JavaRDD<String> rd = this.sc.textFile(path);
        rd = filter_r_data(rd, rd.first());
        this.data = rd.mapToPair((String s) -> new Tuple2<>(s.split(",")[0], s.split(",")[1]));
    }

    public void saveVariation() {
        this.variation.saveAsTextFile("src/resources/btc_variation.csv");
    }

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
//        JavaRDD<String> date = this.data.keys();
//        date = filter_r_data(date, date.first());
//        JavaPairRDD<Integer, String> datePair = date.keyBy(f1);
        //calcule the variation
//        JavaRDD<String> variation = this.data.values();
//        List<String> lists = variation.collect();
//        List<Float> variations = new ArrayList<>();
//        Iterator<String> it = lists.iterator();
//
//        boolean first = true;
//        float var = 0;
//        while (it.hasNext()) {
//            String last, actual = "";
//            if (first) {
//                last = it.next();
//                actual = it.next();
//                first = false;
//            } else {
//                last = actual;
//                actual = it.next();
//            }
//            var = Float.valueOf(actual) - Float.valueOf(last);
//            variations.add(var);
//        }
//        JavaRDD<Float> variationOnly = sc.parallelize((List<Float>) variations);
//        JavaPairRDD<Integer, Float> variationPair = variation.keyBy(f1);
//
//        this.variation = variationPair.join(datePair);
    }

//    public void Function(){
//        @Override
//        public Object call(Object t1){
//        
//    }
//    }
//    public void VoidFunction(Iterator<String> it) {
//        int i = 0;
//        float variation = 0;
//        String last, actual = "";
//        List<Float> variations = new ArrayList<>();
//        while (it.hasNext()) {
//            if (i == 0) {
//                last = it.next();
//                actual = it.next();
//                i++;
//                variation = Float.valueOf(actual) - Float.valueOf(last);
//            } else {
//                last = actual;
//                actual = it.next();
//                variation = Float.valueOf(actual) - Float.valueOf(last);
//            }
//            variations.add(variation);
//        }
//    }
    public void date_parser(String date) {
        String[] strs = date.split("-");

    }

    public JavaPairRDD<String, String> getData() {
        return this.data;
    }

    private JavaRDD<String> filter_r_data(JavaRDD<String> data, String s) {
        return data.filter((String str) -> !str.equals(s));
    }

    public JavaPairRDD<String, Float> getVariation() {
        return this.variation;
    }

}
