<?php
	error_reporting(0);
	$spark_path="/home/sandro/spark-1.6.1-bin-hadoop2.6/bin/spark-submit";
	$class=$_POST['class'];
	$jar_path=$_POST['jar_path']; // /opt/lampp/htdocs/bitcoinspark/spark/vectorization_2.10-1.0.jar
	$args=$_POST['args'];
	$comando="$spark_path --class $class --master local[2] $jar_path $args";
	//$comando="whoami";
	//echo $comando;exit();
	exec($comando,$output,$status);
	$result=array();
	$result['comando']=$comando;
	$result['status']=$status;
	$result['output']=$output;
	echo json_encode($result);
?>