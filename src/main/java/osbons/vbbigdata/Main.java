package osbons.vbbigdata;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import cc.mallet.classify.*;

/**
 *
 * @author Jean-Loïc Mugnier <mugnier at polytech.unice.fr>
 */
public class Main {

    public static void main(String[] args) {

        String mode = "local[*]";
        BtcDataReader btcR = new BtcDataReader("btc valuation", "local");
        btcR.importData("src/resources/btc_valuation.csv");
//        System.out.println("\n\ndata: " + btcR.getData().take(10).toString());
        btcR.calculateVariation();
//        System.out.println("\n\nvariation: " + btcR.getVariation().take(10).toString());
        
    }
}
