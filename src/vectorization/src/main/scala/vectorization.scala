import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.ml.feature.Word2Vec

object Vectorization {
  def main(args: Array[String]) {
	val conf = new SparkConf().setAppName("Vectorization")
	val sc = new SparkContext(conf)
	/* start - runnable in shell */
	val vectorSize=4; // Change this vector size accordingly
	val path="/home/bruno/Programming/BigData/BigDataTime/news-output/BBC/bitcoin-1-http__www-bbc-co-uk_news_technology-36197703" // Change this to file path
	val lines=sc.textFile(path).flatMap(line=>line.replaceAll("[^A-Za-z0-9]", "").split(" "))
	val sqlContext=SQLContext.getOrCreate(sc);
	val docDF=sqlContext.createDataFrame(Seq(lines.collect()).map(Tuple1.apply)).toDF("text")
	val word2vec = new Word2Vec().setInputCol("text").setOutputCol("result").setVectorSize(vectorSize).setMinCount(0)
	val model=word2vec.fit(docDF)
	val result=model.transform(docDF)
	result.select("result").foreach(println)
	/* end - runnable in shell */
  }
}

