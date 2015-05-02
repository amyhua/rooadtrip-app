angular.module('App.controllers')
  .controller("mainCtrl", function($scope) {
    $("#login-button").click(function(event) {
      event.preventDefault();

      $('form').fadeOut(500);
      $('.wrapper').addClass('form-success');
    });

    yam.connect.loginButton('#yammer-login', function(resp) {
      if (resp.authResponse) {
        console.log('yammer logged in', resp);
      }
    });
  });