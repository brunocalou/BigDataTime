import org.apache.spark.rdd.RDD
import org.apache.spark.mllib.linalg.Vector
import org.apache.spark.mllib.linalg.Vectors
import scala.math._

case class Coord(x: Int, y: Int)
case class Neuron(coord: Coord, weight: Vector)

class SOM(dataSize: Int, maxIter: Int, w: Int, h: Int, maxNeigh: Double) {
	private val rnd = new scala.util.Random()
	private val rndWeight = Array.fill(dataSize)(abs(rnd.nextDouble) % 100)

	var kohonenMap = (for(x <- 0 until w; y <- 0 until h) yield 
						Neuron(Coord(x,y), Vectors.dense(rndWeight))).toArray

	private def euclid(vec1: Vector, vec2: Vector) = {
		sqrt(Vectors.sqdist(vec1, vec2))
	}

	private def winner(vec: Vector) = {
		var winningNeuron = kohonenMap(0)
		kohonenMap.foreach( x =>
			if(euclid(winningNeuron.weight, x.weight) >
			   euclid(vec, x.weight)) winningNeuron = x)
		winningNeuron
	}

	private def neighfun(i: Coord, j: Coord, iter: Int) = {
		val d = abs(i.x - j.x) + abs(i.y - j.y)
		if (d <= maxNeigh) exp(-iter * pow(d,2))
		else 0
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

	private def updatemap(vec: Vector, iter: Int) {
		val winningNeuron = winner(vec)
		kohonenMap = kohonenMap.map(x => Neuron(x.coord, sumVec(x.weight,
			multiplyVecScalar(subtractVec(vec, winningNeuron.weight),
				neighfun(x.coord, winningNeuron.coord, iter)))))
	}

	def train(data: RDD[Vector]) = {
		for(iter <- 0 until maxIter) {
			data.foreach(x => updatemap(x, iter))
		}
	}
}

object teste extends App {
	val mapa = new SOM(1000,100,9,12,4)
}




