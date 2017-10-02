
const app = angular.module('sw.main');

app.directive('movieCard', require('./movieCard'));
app.directive('crawlChart', require('./crawlChart'));
app.directive('characterCard', require('./characterCard'));

module.exports = app;