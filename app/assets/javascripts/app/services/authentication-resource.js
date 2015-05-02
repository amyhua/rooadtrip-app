angular.module('App.services')
  .service('AuthenticationResource', function authenticationResource($resource) {
    return $resource('/authentication', {}, {
      'login': {
        method: 'POST'
      }
    });
  });