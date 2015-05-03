angular.module('App.controllers')
  .controller("ApplicationController", function($scope, $rootScope) {
    $rootScope.$on('$routeChangeError', function(event, error) {
      console.error('Route Change Error', error);
    });

    $scope.alerts = [];
    $rootScope.$on('alert', function(event, msg) {
      $scope.alerts.push(msg);
    }.bind(this));

  });