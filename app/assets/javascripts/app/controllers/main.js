angular.module('App.controllers')
  .controller("mainCtrl", function($scope, $location) {
    $("#login-button").click(function(event) {
      event.preventDefault();

      $('form').fadeOut(500);
      $('.wrapper').addClass('form-success');
      // hack until auth
      $location.path('/dashboard');
    });

    if (yam) {
      yam.connect.loginButton('#yammer-login', function(resp) {
        if (resp.authResponse) {
          localStorage.getItem('token');
          console.log('yammer logged in', resp);
          $location.path('/dashboard');
          $scope.$apply();
        } else {
          localStorage.setItem('token', null);
        }
      });
    }
  });