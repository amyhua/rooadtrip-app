var authenticate = function($location, $q) {
  'use strict';

  var deferred = $q.defer();
  if (yam !== undefined) {
    yam.getLoginStatus(
      function(response) {
        if (response.authResponse) {
          // logged in
          console.log(response); //print user information to the console
          deferred.resolve(response);
          return response;
        } else {
          //authResponse = false if the user is not logged in, or is logged in but hasn't authorized your app yet
          deferred.reject();
          $location.path("/");
        }
      }
    );
  } else {
    // hack fix this
    deferred.resolve('hack auth');
  }

  return deferred.promise;
};

angular.module('App.services', []);
angular.module('App.controllers', []);
angular.module('App.directives', []);
angular.module('App.filters', []);
angular.module('App', [
  'ngRoute',
  'App.controllers',
  'App.services',
  'App.filters',
  'App.directives',
  'leaflet-directive'
])
  .config(function($routeProvider, $sceDelegateProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main.html',
        controller: 'mainCtrl',
        resolve: {}
      })
      .when('/dashboard', {
        templateUrl: 'dashboard.html',
        controller: 'dashboardCtrl as dashboard',
        resolve: {
          connected: authenticate
        }
      })
      .otherwise({
        redirectTo: 'main.html'
      });

    // allow youtube video urls to load
    $sceDelegateProvider.resourceUrlWhitelist([
      // allow same origin resource loads
      'self',
      'http://74.73.85.220/**'
    ]);
  });