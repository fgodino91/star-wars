

module.exports = [
	'$scope',
	'swapi',
	function ($scope, swapi) {

		//For some reason they removed the poster image field from the swapi API
		//this map is taken from the swapi source code https://github.com/joshghent/swapi/blob/7868c5b4eee2875828165834a500d984b0df8cea/resources/fixtures/films.json
		const movieMap = {
			'4' : 'http://vignette2.wikia.nocookie.net/starwars/images/2/21/Star_wars_old.jpg/revision/latest?cb=20100708051712',
        	'5' : 'http://vignette3.wikia.nocookie.net/starwars/images/e/e4/Empire_strikes_back_old.jpg/revision/latest?cb=20161114072554',
        	'6' : 'http://vignette2.wikia.nocookie.net/starwars/images/b/b2/ReturnOfTheJediPoster1983.jpg/revision/latest?cb=20080819092048',
        	'1' : 'http://vignette2.wikia.nocookie.net/starwars/images/7/75/EPI_TPM_poster.png/revision/latest/scale-to-width-down/1000?cb=20130822171446',
        	'2' : 'http://vignette4.wikia.nocookie.net/starwars/images/d/dd/Attack-Clones-Poster.jpg/revision/latest?cb=20160411165436',
        	'3' : 'http://vignette2.wikia.nocookie.net/starwars/images/e/e7/EPIII_RotS_poster.png/revision/latest/scale-to-width-down/1000?cb=20130822174232',
        	'7' : 'http://vignette2.wikia.nocookie.net/starwars/images/f/fd/Star_Wars_Episode_VII_The_Force_Awakens.jpg/revision/latest/scale-to-width-down/1000?cb=20151018162823'
		}
		
		const self = this;

		swapi.films.all()
			.then((result) => {
				self.movies = result.results;

				(self.movies || []).sort((movieA, movieB) => {
					//Add the poster during sorting
					movieA.poster = movieMap[movieA.episode_id];
					movieB.poster = movieMap[movieB.episode_id];

					return movieA.episode_id > movieB.episode_id;
				})
			})
			.catch((err) => {
				self.error = err;
			})

		self.favoriteCharacter = {
		    'name': 'Luke Skywalker',
			'birth_year': '19 BBY',
			'photo' : 'https://vignette.wikia.nocookie.net/starwars/images/2/20/LukeTLJ.jpg/revision/latest/scale-to-width-down/500?cb=20170927034529',
		    'hair_color': 'Blond'
		}

		self.leastFavoriteCharacter = {
			'name': 'Chewbacca', 
		    'birth_year': '200BBY',
		    'photo' : 'https://vignette.wikia.nocookie.net/starwars/images/e/ec/ChewbaccaCSWE.jpg/revision/latest/scale-to-width-down/350?cb=20130702064257',
		    'hair_color': 'brown', 
		    'eye_color': 'blue'
		}

		$scope.getEvenIndexes = function(maxSize){
			const result = [];
			for(var i=0; i < maxSize; i += 2){
				result.push(i);
			}
			return result;
		}

	}
]
