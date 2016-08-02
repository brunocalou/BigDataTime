package osbons.vbbigdata;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.Row;

/**
 *
 * @author Jean-Loïc Mugnier <mugnier at polytech.unice.fr>
 */
public class Main {

    public static void main(String[] args) {
        SparkConf conf;
        conf = new SparkConf().setAppName("btc valuation").setMaster("local");
        JavaSparkContext sc = new JavaSparkContext(conf);
//        System.out.println("1st: variation classification\n2nd: date (year-month-day)");
//        if (args.length != 2) {
//            System.err.print("Wrong number of arguments!\n");
//        }
        String mode = "local[*]";
        BtcDataReader btcR = new BtcDataReader(sc);
        btcR.importData("src/resources/btc_valuation.csv");
        System.out.println("Calculating Variation..\n");
        btcR.calculateVariation();
        System.out.println("Calculating Variation done..\n");
        btcR.saveVariation();
//        System.out.println(args[0]);
//        if ("variation".equals(args[0])) {
//            Float f = btcR.getVariation(args[1]);
//            System.out.println("\n\n");
//            System.out.println(f);
//            System.out.println("\n\n");
//        }
        Classification c = new Classification(sc, "variation", "datenews");
//        System.out.println("\n\n" + c.runClassification().collect().toString());
        System.out.println("Doing Classifcation..\n");
        c.runClassification();
        System.out.println("Classifcation done..\n");
        c.saveClassification();

    }
}
