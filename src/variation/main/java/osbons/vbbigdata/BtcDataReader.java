package osbons.vbbigdata;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.rdd.RDD;
import org.apache.spark.sql.SQLContext;
import org.apache.spark.sql.DataFrame;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.RowFactory;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructField;
import org.apache.spark.sql.types.StructType;
import scala.Tuple2;

/**
 * BtcDataReader is the class responsible for reading the csv file about the
 * valuation of the btc. It is also responsible for create the variation RDD
 * with the variation of the btc from day n, to day n+1
 *
 * Como Rodar o BtcDataReader
 *
 * Parametros do Spark App name mode path btc csv file *
 *
 * Metodos importData Importa os dados do arquivo csv para o JavaPairRDD onde a
 * chave é a data, no formato ano-mes-dia.
 *
 * CalculateVariation Este método usa o JavaPairRDD com a data e o valor do btc
 * para calcular a variação do btc. Nesse cálculo, consideraremos a variação do
 * btc de um dia para o outro. Logo no dia n, o valor da variação será igual ao
 * valor do btc no dia n-1 e do valor do btc no dia n.
 *
 * getValuation
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
    private static JavaPairRDD<String, String> variation;
    private final JavaSparkContext sc;
    private final SQLContext sqlContext;
    private DataFrame dfVariation;

    public BtcDataReader(String name, String mode) {
        SparkConf conf;
        conf = new SparkConf().setAppName(name).setMaster(mode);
        this.sc = new JavaSparkContext(conf);
        this.sqlContext = new SQLContext(this.sc);

    }

    /**
     * Import the csv file to our data pairRDD
     *
     * @param path, path to the csv file
     */
    public void importData(String path) {
        JavaRDD<String> rd = this.sc.textFile(path);
        rd = filter_r_data(rd, rd.first());
        this.data = rd.mapToPair((String s) -> new Tuple2<>(s.split(",")[0], (s.split(",")[1])));
    }

    /**
     * save csv file associated to the variation rdd
     */
    private void saveVariation() {
        this.variation.saveAsTextFile("src/resources/btc_variation.csv");
    }

    /**
     * Calculates the variation and creates the rdd associated to the values.
     */
    public void calculateVariation() {

        List<Tuple2<String, String>> d = data.collect(); //handle date - remove fisrt
        List<Tuple2<String, String>> lvar = new ArrayList<>();
        Iterator<Tuple2<String, String>> it = d.iterator();
        Float first = Float.valueOf(it.next()._2()); // já removeu a primeira data
        while (it.hasNext()) {
            Tuple2<String, String> row = it.next();
            String date = row._1();
            Float value = Float.valueOf(row._2());
            Float var = value - first;
            Tuple2<String, String> t = new Tuple2<>(date, String.valueOf(var));
            lvar.add(t);
            first = value;
        }
        this.variation = sc.parallelizePairs(lvar);
        setDataFrameVariation();
    }

    public JavaPairRDD<String, String> getData() {
        return this.data;
    }

    static Function prepareRow = (Function<Tuple2<String, String>, Row>) (Tuple2<String, String> record) -> {
//        String[] fields = record.split(",");
        return RowFactory.create(record._1(), record._2());
    };

    private JavaRDD prepareRows(JavaPairRDD cpy) {
        RDD<Tuple2<String, String>> rdd = cpy.rdd();
        JavaRDD<Tuple2<String, String>> jRdd = rdd.toJavaRDD();
        jRdd = jRdd.map(prepareRow);// The schema is encoded in a string
        return jRdd;
    }

    private StructType prepareSchema() {
        String schemaString = "date variation";

// Generate the schema based on the string of schema
        List<StructField> fields = new ArrayList<StructField>();
        for (String fieldName : schemaString.split(" ")) {
            fields.add(DataTypes.createStructField(fieldName, DataTypes.StringType, true));
        }
        StructType schema = DataTypes.createStructType(fields);
        return schema;
    }

    private void setDataFrameVariation() {
        JavaPairRDD jpr = this.variation;
        JavaRDD jRdd = prepareRows(jpr);
        StructType schema = prepareSchema();
        this.dfVariation = sqlContext.createDataFrame(jRdd, schema);
    }

    public Float getVariation(String date) {
        return Float.valueOf(this.dfVariation.filter(dfVariation.col("date").equalTo(date)).first().get(1).toString());

    }

    public DataFrame getVariationDF() {
        return this.dfVariation;
    }

    /**
     * RDD filter by removing the string s from the RDD
     *
     * @param data, RDD
     * @param s, String to remove from the RDD
     * @return, RDD without the s value
     */
    private JavaRDD<String> filter_r_data(JavaRDD<String> data, String s) {
        return data.filter((String str) -> !str.equals(s));
    }

    public JavaPairRDD<String, String> getVariation() {
        return this.variation;
    }

}
