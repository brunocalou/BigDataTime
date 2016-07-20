import org.apache.spark.SparkContext
import org.apache.spark.SparkConf
import org.apache.spark.rdd.RDD
import org.apache.spark.mllib.linalg.Vector
import org.apache.spark.mllib.linalg.Vectors
import scala.math._
import java.io._

case class Coord(x: Int, y: Int)
case class Distance(up: Double, right: Double)
case class Neuron(coord: Coord, weight: Vector, var dist: Distance)

class SOM(dataSize: Int, maxIter: Int, w: Int, h: Int, maxNeigh: Double) extends java.io.Serializable {
	private val rnd = new java.util.Random
	private def rndWeight = {
		Array.fill(dataSize)(rnd.nextDouble)
	}

	private var maxDist: Double = Double.NegativeInfinity
	private var minDist: Double = Double.PositiveInfinity

	private var clusters = Array.ofDim[Int](w,h)
	private var maxCluster: Int = 0
	private var kohonenMap = (for(x <- 0 until w; y <- 0 until h) yield 
						Neuron(Coord(x,y), Vectors.dense(rndWeight), Distance(-1,-1))).toArray

	private def euclid(vec1: Vector, vec2: Vector) = {
		sqrt(Vectors.sqdist(vec1, vec2))
	}

	private def winner(vec: Vector): Neuron = {
		var neuron = kohonenMap(0)
		kohonenMap.foreach( x =>
			if(euclid(vec, neuron.weight) >
			   euclid(vec, x.weight)) neuron = x)
		return neuron
	}

	private def neighfun(i: Coord, j: Coord, iter: Int) = {
		val d = (abs(i.x - j.x) + abs(i.y - j.y)).toDouble
		if (d <= maxNeigh) exp(-iter * pow(d,2))
		else 0.0
	}

	private def normalize(dist: Distance): Distance = {
		val ratio = maxDist - minDist
		val newRight = (dist.right - minDist)/ratio
		val newUp = (dist.up - minDist)/ratio

		if(dist.up >= 0 && dist.right >= 0) Distance(newUp, newRight)
		else if(dist.up >= 0 && dist.right < 0) Distance(newUp, dist.right)
		else if(dist.up < 0 && dist.right >= 0) Distance(dist.up, newRight)
		else dist
	}

	private def sumVec(vec1: Vector, vec2: Vector) = {
		val res = (for(i <- 0 until vec1.size) yield (vec1(i) + vec2(i))).toArray
		Vectors.dense(res)
	}

	private def subtractVec(vec1: Vector, vec2: Vector) = {
		val res = (for(i <- 0 until vec1.size) yield (vec1(i) - vec2(i))).toArray
		Vectors.dense(res)
	}

	private def multiplyVec(vec1: Vector, vec2: Vector) = {
		val res = (for(i <- 0 until vec1.size) yield (vec1(i) * vec2(i))).toArray
		Vectors.dense(res)
	}

	private def multiplyVecScalar(vec: Vector, num: Double) = {
		val res = (for(i <- 0 until vec.size) yield (vec(i) * num)).toArray
		Vectors.dense(res)
	}

	private def createClusters(n: Neuron, limit: Double) {
		if(clusters(n.coord.x)(n.coord.y) == 0) {
			maxCluster = maxCluster + 1
			clusters(n.coord.x)(n.coord.y) = maxCluster
		}
		if(n.dist.up <= limit && n.dist.up >= 0.0){
			clusters(n.coord.x)(n.coord.y + 1) = clusters(n.coord.x)(n.coord.y)
		}
		if(n.dist.right <= limit && n.dist.right >= 0.0){
			clusters(n.coord.x + 1)(n.coord.y) = clusters(n.coord.x)(n.coord.y)
		}
	}

	private def updatemap(vec: Vector, iter: Int) {
		val winningNeuron = winner(vec)
		kohonenMap = kohonenMap.map(n => Neuron(n.coord, sumVec(n.weight,
				multiplyVecScalar(subtractVec(vec, winningNeuron.weight),
					neighfun(n.coord, winningNeuron.coord, iter))),
			n.dist))
	}

	private def calculateDist {
		for( x <- 0 until w; y <- 0 until h) {
			if(x != w - 1){
				val rightNeuron = kohonenMap((x + 1)*w + y).weight
				val centerNeuron = kohonenMap(x*w + y)
				val newRight = euclid(centerNeuron.weight, rightNeuron)
				kohonenMap(x*w + y).dist = Distance(centerNeuron.dist.up, newRight)
				maxDist = max(maxDist, newRight)
				minDist = min(minDist, newRight)
			}
			if(y != h - 1){
				val upNeuron = kohonenMap(x*w + (y + 1)).weight
				val centerNeuron = kohonenMap(x*w + y)
				val newUp = euclid(centerNeuron.weight, upNeuron)
				kohonenMap(x*w + y).dist = Distance(newUp, centerNeuron.dist.right)
				maxDist = max(maxDist, newUp)
				minDist = min(minDist, newUp)
			}
		}
		kohonenMap = kohonenMap.map(n => Neuron(n.coord, n.weight, normalize(n.dist)))
	}

	def train(data: RDD[Vector]) {
		for(iter <- 0 until maxIter) {
			data.foreach(x => updatemap(x, iter))
		}
		calculateDist
	}

	def clusterize(limit: Double) {
		kohonenMap.foreach(n => createClusters(n, limit))
	}

	def getCluster(data: RDD[Vector]) = {
		(for( i <- 0 until data.count.toInt) yield {
			val winningNeuron = winner(data.collect()(i))
			clusters(winningNeuron.coord.x)(winningNeuron.coord.y)
		}).toVector
	}

	def getClusterSize = {
		maxCluster
	}

	def getClusterMap = {
		clusters
	}

	def getMap = {
		kohonenMap
	}
}

object teste extends App {
	val sc = new SparkContext(new SparkConf )
	val mapa = new SOM(4,100,2,2,1)
	val file = sc.textFile("example.txt")
	val input = file.map(lines => {
	val line = lines.split(",")
	val lineMap = line.map(_.toDouble)
	Vectors.dense(lineMap)
	})
	mapa.train(input)
	mapa.clusterize(0.1)
	println("\n\n\n\n\n" + mapa.getClusterSize + "\n\n\n\n\n")
	//mapa.getClusterMap.foreach(x => println("\n\n\n\n\n" + x + "\n\n\n\n\n"))
	println("Agora, eis o mapa:")
	mapa.getMap.foreach(x => println("\n\n\n\n\n" + x + "\n\n\n\n\n"))
	val result = mapa.getCluster(input)
	println("\n\n\n\n\n" + result + "\n\n\n\n\n")
	val oos = new ObjectOutputStream(new FileOutputStream("C:/debora/KohonenMap"))
	oos.writeObject(mapa)
	oos.close
}




