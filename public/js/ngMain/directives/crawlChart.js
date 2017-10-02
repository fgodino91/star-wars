
const ChartJS = require('chart.js');
const randomColor = require('randomcolor');

module.exports = [
	'$http',
	'$q',
	function($http, $q) {
	    return {
	        restrict: 'AE',
	        scope: {
	            movies : '=',
	        },
	        replace: true,
	        template: '<canvas id="crawlChart" width="100%" height="100"></canvas>',
	        link : function(scope, element, attrs) {

	            const myChart = new Chart(element, {
				    type: 'bar',
				    options: {
				        scales: {
				            yAxes: [{
				                ticks: {
				                    beginAtZero:true
				                }
				            }]
				        },
				        legend: {
			            	display: false
				        }
				    }
				});

	        	scope.$watch('movies', function(){
	        		if(!scope.movies) return;

	        		myChart.data = scope.movies.reduce((memo, item) => {
	        			memo.labels.push('Episode ' + item.episode_id);
	        			memo.datasets[0].data.push(countWords(item.opening_crawl));
	        			memo.datasets[0].backgroundColor.push(randomColor({
						   luminosity: 'bright',
						   format: 'rgb'
						}));

	        			return memo;
	        		}, {
	        			labels : [],
	        			datasets : [{
	        				label : '# of opening crawl words',
	        				data: [],
	        				backgroundColor : []
	        			}]
	        		});

	        		myChart.update();

	        	});


	        	function countWords(str){
	        		const matches = str.match(/\S+/g) ;
    				return matches ? matches.length : 0;
	        	}
	            
	        }
	    };

	}
];
