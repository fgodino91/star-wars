
require('public/css/main.scss');
require('ne-swapi');

const app = angular.module('sw.main', ['ngResource', 'ne.swapi']);

require('./directives');
require('./controllers');

module.exports = app;