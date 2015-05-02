angular.module('App.services')
  .service('Authentication', function($q, AuthenticationResource) {
    'use strict';
    // Our session token
    var token = localStorage.getItem('token');
    // Cache the current user
    var user = null;
    // Return the cached user or try to fetch it
    this.getUser = function getUser() {
      var deferred = $q.defer();
      // Cache hit
      if (user) {
        deferred.resolve(user);
      } else {
        var success = function success(response) {
          user = response;
          deferred.resolve(user);
        };
        var error = function error(data, status) {
          deferred.reject({
            'data': data,
            'status': status || data.status
          });
        };
        // AuthenticationResource.get({
        //   'token': token
        // }, success, error);
        deferred.resolve(user);
      }
      return deferred.promise;
    };
  });