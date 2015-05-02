angular.module('App.services', []);
angular.module('App.controllers', []);
angular.module('App.filters', []);
angular.module('App', [
  'ngRoute',
  'App.controllers',
  'App.services',
  'App.filters'
])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main.html',
        controller: 'mainCtrl',
        resolve: {}
      })
      .when('/dashboard', {
        templateUrl: 'dashboard.html',
        controller: 'dashboardCtrl',
        resolve: {}
      })
      .otherwise({
        redirectTo: 'main.html'
      });
  });