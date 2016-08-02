// function randomScalingFactor() {
// 	return Math.round(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1));
// }
function randomColorFactor() {
	return Math.round(Math.random() * 255);
}
function randomColor(opacity) {
	return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
}
// function newDate(days) {
// 	return moment().add(days, 'd').toDate();
// }
// function newDateString(days) {
// 	return moment().add(days, 'd').format();
// }
// var texts=[];
// for(var i=0;i<10;i++)
// {
// 	texts.push({"title":"Titulo"+i,"text":"ASdfkpoasfkpokasfokapofKPOFAKaspofkpoaskgfPOAKgPOAGKpo","date":newDateString(i)});	
// }
// var dataset1={};
// dataset1.label="News";
// dataset1.fill=false;
// dataset1.data=[];
// for(var i=0;i<texts.length;i++)
// {	
// 	dataset1.data.push({x:texts[i]["date"],y:randomScalingFactor(),label:texts[i]["title"]});	
// }
// var config = {
// 	type: 'line',
// 	data: {
// 		datasets: [dataset1]
// 	},
// 	options: {
// 		responsive: true,
//         title:{
//             display:true,
//             text:"Chart.js Time Point Data"
//         },
// 		scales: {
// 			xAxes: [{
// 				type: "time",
// 				display: true,
// 				scaleLabel: {
// 					display: true,
// 					labelString: 'Date'
// 				}
// 			}],
// 			yAxes: [{
// 				display: true,
// 				scaleLabel: {
// 					display: true,
// 					labelString: 'value'
// 				}
// 			}]
// 		}
// 	}
// };
var config = {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Clusters',
                data: [{
                    y: 6.10/100,
                    r: 6.10 * 2,
                    x: 19
                },{
                    y: 6.00/100,
                    r: 6.00 * 2,
                    x: 1
                }, {
                    y: 3.50/100,
                    r: 3.50 * 2,
                    x: 2
                }, {
                    y: 1.00/100,
                    r: 1.00 * 2,
                    x: 3
                }, {
                    y: 2.20/100,
                    r: 2.20 * 2,
                    x: 4
                }, {
                    y: 9.90/100,
                    r: 9.90 * 2,
                    x: 5
                }, {
                    y: 1.30/100,
                    r: 1.30 * 2,
                    x: 6
                }, {
                    y: 0.30/100,
                    r: 0.30 * 2,
                    x: 7
                }, {
                    y: 2.40/100,
                    r: 2.40 * 2,
                    x: 8
                }, {
                    y: 6.90/100,
                    r: 6.90 * 2,
                    x: 9
                }, {
                    y: 1.00/100,
                    r: 1.00 * 2,
                    x: 10
                }, {
                    y: 3.60/100,
                    r: 3.60 * 2,
                    x: 11
                }, {
                    y: 7.70/100,
                    r: 7.70 * 2,
                    x: 12
                }, {
                    y: 9.70/100,
                    r: 9.70 * 2,
                    x: 13
                }, {
                    y: 9.20/100,
                    r: 9.20 * 2,
                    x: 14
                }, {
                    y: 0.60/100,
                    r: 0.60 * 2,
                    x: 15
                }, {
                    y: 8.20/100,
                    r: 8.20 * 2,
                    x: 16
                }, {
                    y: 2.40/100,
                    r: 2.40 * 2,
                    x: 17
                }, {
                    y: 9.10/100,
                    r: 9.10 * 2,
                    x: 18
                }]
            }]
        },
        text: "Variação do Bitcoin",
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
						display: true,
						labelString: 'Número do Cluster'
					}
                }],
                yAxes: [
                {
                	scaleLabel: {
                		display: true,
                		labelString: "Variância"
                	}
                }]
            }
        }
    };

$.each(config.data.datasets, function(i, dataset) {
	dataset.borderColor = randomColor(0.4);
	dataset.backgroundColor = randomColor(0.5);
	dataset.pointBorderColor = randomColor(0.7);
	dataset.pointBackgroundColor = randomColor(0.5);
	dataset.pointBorderWidth = 1;
});
// window.onload = function() {
// 	var ctx = document.getElementById("canvas").getContext("2d");
// 	window.myLine = new Chart(ctx, config);
// };
// $('#randomizeData').click(function() {
// 	$.each(config.data.datasets, function(i, dataset) {
// 		$.each(dataset.data, function(j, dataObj) {
// 			dataObj.y = randomScalingFactor();
// 		});
// 	});
// 	window.myLine.update();
// });
// $('#addData').click(function() {
// 	if (config.data.datasets.length > 0) {
// 		var lastTime = myLine.scales['x-axis-0'].labelMoments[0].length ? myLine.scales['x-axis-0'].labelMoments[0][myLine.scales['x-axis-0'].labelMoments[0].length - 1] : moment();
// 		var newTime = lastTime
// 			.clone()
// 			.add(1, 'day')
// 			.format('MM/DD/YYYY HH:mm');
// 		for (var index = 0; index < config.data.datasets.length; ++index) {
// 			config.data.datasets[index].data.push({
// 				x: newTime,
// 				y: randomScalingFactor()
// 			});
// 		}
// 		window.myLine.update();
// 	}
// });
// $('#removeData').click(function() {
// 	config.data.datasets.forEach(function(dataset, datasetIndex) {
// 		dataset.data.pop();
// 	});
// 	window.myLine.update();
// });

window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
};
