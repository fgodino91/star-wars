
require('public/css/characterCard.scss');

module.exports = [
	function() {
	    return {
	        restrict: 'AE',
	        scope: {
	            characterCard : '=',
	        },
	        replace: true,
	        templateUrl: '/js/ngMain/templates/characterCard.html',
	        link : function(scope, element, attrs) {
	            
	            scope.character = scope.characterCard;
	        }
	    };

	}
];
