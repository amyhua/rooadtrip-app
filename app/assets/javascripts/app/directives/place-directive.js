angular.module('App.directives')
  .directive('place', function() {
    return {
      restrict: 'EAC',
      scope: {
        place: '=',
        pins: '='
      },
      require: '^map',
      link: function($scope, element, attrs, mapCtrl) {
        console.log('place making');

        var marker = L.marker($scope.place.latlng);
        marker.id = Date.now();
        $scope.pins[marker.id] = marker;
        mapCtrl.addMarker(marker);

        $scope.$on('$destroy', function() {
          // remove marker
          mapCtrl.removeLocation($scope.place.pinId);
        });
      }
    };
  });