package osbons.vbbigdata;

import org.apache.spark.sql.Row;

/**
 *
 * @author Jean-Loïc Mugnier <mugnier at polytech.unice.fr>
 */
public class Main {

    public static void main(String[] args) {
        if (args.length != 2) {
            System.out.println("1st: variation\n2nd: date (year-month-day)");
            System.err.print("Wrong number of arguments!\n");
        }
        String mode = "local[*]";
        BtcDataReader btcR = new BtcDataReader("btc valuation", "local");
        btcR.importData("src/resources/btc_valuation.csv");
        btcR.calculateVariation();
        System.out.println(args[0]);
        if ("variation".equals(args[0])) {
            Float f = btcR.getVariation(args[1]);
            System.out.println("\n\n");
            System.out.println(f);
            System.out.println("\n\n");
        }

    }
}
