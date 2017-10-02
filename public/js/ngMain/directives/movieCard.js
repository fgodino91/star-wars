
require('public/css/movieCard.scss');

module.exports = [
	'$http',
	'$q',
	function($http, $q) {
	    return {
	        restrict: 'AE',
	        scope: {
	            movieCard : '=',
	        },
	        replace: true,
	        templateUrl: '/js/ngMain/templates/movieCard.html',
	        link : function(scope, element, attrs) {
	            
	            scope.movie = scope.movieCard;
	            scope.threeCharacters = [];

	            $q.all(_.sample(scope.movie.characters, 3).map((character) => {
	            	return $http.get(character, { cache : true })
	            		.then((res) => {
	            			return res.data;
	            		})
	            }))
	            	.then((characters) => {
	            		return scope.threeCharacters = characters;
	            	});

	        }
	    };

	}
];
