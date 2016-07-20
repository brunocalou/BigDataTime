import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.Column
import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.SaveMode
import org.apache.spark.ml.feature.Word2Vec
import java.io.File
import java.io.PrintWriter
import java.io.FileOutputStream

object Vectorization {
  
  def getListOfFiles(dir: String):List[File] = {
	    val d = new File(dir)
	    if (d.exists && d.isDirectory) {
	        d.listFiles.filter(_.isFile).toList
	    } else {
	        List[File]()
	    }
	}
  def vectorize(path: String,vectorSize: Int):Array[Any] = {
  		val conf = new SparkConf().setAppName("Vectorization");
  		val sc=SparkContext.getOrCreate(conf)
  		val sqlContext=SQLContext.getOrCreate(sc);
	  	val urlRegex ="\\b(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";
		val dateRegex="\\d{4}-\\d{2}-\\d{2}";
		
		val text=sc.textFile(path)
		.filter(line=>(!(line.matches(dateRegex)||line.matches(urlRegex)))) // remove linhas que são URL ou data
		.flatMap(line=>line.replaceAll("[^A-Za-z0-9 ]", "").split(" ")) // espaço na regex é importante			
		val docDF=sqlContext.createDataFrame(Seq(text.collect()).map(Tuple1.apply)).toDF("text")
		val word2vec = new Word2Vec().setInputCol("text").setOutputCol("result").setVectorSize(vectorSize).setMinCount(0)
		val model=word2vec.fit(docDF)
		val result=model.transform(docDF)
		//val rows: org.apache.spark.rdd.RDD[org.apache.spark.sql.Row] = result.select("result").rdd
		result.select("result").rdd.map(r => r(0)).collect()
		//result.select("result")
  }
  
  def getData (path: String):DataFrame = {
    	val conf = new SparkConf().setAppName("Vectorization");
  		val sc=SparkContext.getOrCreate(conf)
  		val sqlContext=SQLContext.getOrCreate(sc);
  	  	val urlRegex ="\\b(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";
		val dateRegex="\\d{4}-\\d{2}-\\d{2}";
		val text=sc.textFile(path).filter(line=>((line.matches(dateRegex)||line.matches(urlRegex))))
		val dataDF=sqlContext.createDataFrame(Seq(text.collect()).map(Tuple1.apply)).toDF("text")
		dataDF
  }
  
  def main(args: Array[String]) {
	val vectorSize=4; // Alterar tamanho deste vetor de acordo com o desejado

	val folder = if (args.length > 0) args(0) else "";
	val files = getListOfFiles(folder)
	val vectorsDF=files.map(file=>vectorize(file.getPath,vectorSize))
    val conf = new SparkConf().setAppName("Vectorization");
  	val sc=SparkContext.getOrCreate(conf)
	val rdd = sc.parallelize(vectorsDF)
	val rddi = rdd.flatMap(list => list)
	rddi.collect()
	rddi.foreach(a=>
			{
			new PrintWriter(new FileOutputStream("C:/debora/rdds.txt", true)) { 
				write(a.toString()); 
				close; 
				}
			}
		)
	vectorsDF.foreach(vectors=>vectors.foreach(a=>println(a.toString())))	
	vectorsDF.foreach(vectors=>vectors.foreach(a=>
			{
			new PrintWriter(new FileOutputStream("C:/debora/vectors.txt", true)) { 
				write(a.toString()); 
				close; 
				}
			}
		))
	val vectorsData=files.map(file=>getData(file.getPath))
	vectorsData.foreach(vectors=>vectors.foreach(a=>println(a.toString())))	
	vectorsData.foreach(vectors=>vectors.foreach(a=>
			{
			new PrintWriter(new FileOutputStream("C:/debora/data.txt", true)) { 
				write(a.toString()); 
				close; 
				}
			}
		))		
	//vectorsDF.write.mode(SaveMode.Append).parquet("vectors")
  }

}

