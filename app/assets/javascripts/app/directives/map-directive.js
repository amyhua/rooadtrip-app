angular.module('App.directives')
  .directive('map', function($timeout) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        function sizeMap() {
          $timeout(function() {
            var height = $(window).outerHeight(true);
            element.style('height', height);
          });
        }
        $(window).on('resize', function() {
          sizeMap();
        });
        sizeMap();
      }
    };
  });