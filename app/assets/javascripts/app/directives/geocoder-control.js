angular.module('App.directives')
  .directive('placesList', function() {
    return {
      restrict: 'EAC',
      link: function(scope, element, attrs) {
        console.log('placesList', scope);
      }
    };
  })
  .directive('leafletBar', function() {
    return {
      restrict: 'AC',
      link: function(scope, element, attrs) {
        console.log('leafletBar', scope);
      }
    };
  });