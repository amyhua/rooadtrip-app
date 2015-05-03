angular.module('App.directives')
  .directive('autoFade', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.addClass('auto-fade');

        // ticker for removing
        var wait = attrs.autoFade || 2000;
        var interval = parseInt(wait);
        var transitionInterval = 150;

        if (isNaN(interval)) {
          console.error('Expected a number, got ' + attrs.autoFade + '. Using default ' + wait);
        }

        element
          .css('opacity', 1)
          .css('transition', 'all ' + transitionInterval + 'ms linear');

        $timeout(function fade() {
          element.css('opacity', 0);

          $timeout(function hide() {
            element.css('display', 'none');
          }, transitionInterval);
        }, interval);
      }
    };
  });