var authenticate = function($location, $q) {
  'use strict';

  var deferred = $q.defer();
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
  'App.directives'
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
        controller: 'dashboardCtrl as dashboard',
        resolve: {
          connected: authenticate
        }
      })
      .otherwise({
        redirectTo: 'main.html'
      });
  });