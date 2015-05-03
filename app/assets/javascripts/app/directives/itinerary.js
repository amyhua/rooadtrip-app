angular.module('App.directives')
  .directive('itinerary', function($rootScope, $http) {
    return {
      restrict: 'E',
      replace: true,
      require: '^map',
      templateUrl: 'itinerary.html',
      link: function(scope, element, attrs, mapCtrl) {
        console.log('it', scope);

        scope.submit = function(e, tripIndex) {
          function success() {
            scope.trip[tripIndex].editable = false;
            $rootScope.$emit('alert', {
              icon: 'check-circle',
              message: 'Success!'
            });
          }

          success();
        };

        scope.$watchCollection('trip', function editNewPlace(trip, oldTrip) {
          console.log('trip change', trip.length, oldTrip.length);
          if (trip.length - oldTrip.length === 1) {
            // new place --> open edit form of bottom
            // element.find('.itinerary > ul > li:last-child').addClass('editable');
            // element.find('.itinerary > ul > li:last-child .path').addClass('editable');
            $(element.find('.itinerary')).scrollTop(9999);
          }
        }.bind(this));

        scope.chooseTransitMode = function(placeIndex, place, mode) {
          scope.trip[placeIndex].path = {
            transitMode: mode
          };

          scope.trip[placeIndex].path.editable = false;
          scope.trip[placeIndex].path.drawing = true;
        };

        scope.editPlace = function(idx) {
          scope.trip[idx].editable = true;
        };

        scope.editPlacePath = function(idx) {
          if (!scope.trip[idx].path) {
            scope.trip[idx].path = {};
          }
          scope.trip[idx].path.editable = true;
        };

        scope.removePlace = function(idx) {
          var marker = this.trip[idx].pin;
          mapCtrl.removeMarker(marker);
          // disassociate paths
          if (scope.trip[idx - 1]) {
            scope.trip[idx - 1].path = undefined;
          }
          if (scope.trip[idx + 1]) {
            scope.trip[idx + 1].path = undefined;
          }
          scope.trip.splice(idx, 1);
          mapCtrl.refreshGeojson();
        };

        scope.fitMapBounds = mapCtrl.fitMapBounds;
      }
    }
  });