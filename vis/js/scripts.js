function avaliarNoticia()
{
	var main_text=($('#main-text').val());
	$.ajax({
	  method: "POST",
	  dataType:"json",
	  url: "php/spark-exec.php",
	  data: {
	  	class:"org.apache.spark.examples.SparkPi", //Vectorization
	  	jar_path:"/opt/lampp/htdocs/bitcoinspark/spark/spark-examples-1.6.1-hadoop2.6.0.jar", // /opt/lampp/htdocs/bitcoinspark/spark/vectorization.jar
	  	args:main_text
	  }
	})
	  .done(function( data ) {
	  	console.log(data.comando);
	  	if(data.status=="127")
	  	{
	  		console.log("Script não encontrado.");
	  	}
	  	else if(data.status!="0")
	  	{
	  		console.log(data);
	  		console.log("Status:"+data.status);
	  	}
	  	else
	  	{	  		
	    	console.log(data.output);	    	
		}
	  })
	  .fail(function(jqXHR, textStatus){	  	
	  	console.log(jqXHR);
	  	console.log(textStatus);
	  })
}