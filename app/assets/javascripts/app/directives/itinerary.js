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

        scope.chooseTransitMode = function(e, placeIndex, place, mode) {
          scope.trip[placeIndex].path = {
            transitMode: mode
          };

          $(e.target).parent().parent().parent().removeClass('editable');
          scope.trip[placeIndex].path.editable = false;
          scope.trip[placeIndex].path.drawing = true;
          var start = {
            x: scope.trip[placeIndex - 1].latlng.lng,
            y: scope.trip[placeIndex - 1].latlng.lat
          };
          var end = {
            x: scope.trip[placeIndex].latlng.lng,
            y: scope.trip[placeIndex].latlng.lat
          };
          var bounds = [
            [start.y, start.x],
            [end.y, end.x]
          ];

          if (mode === 'Car/Taxi' || mode === 'Biking' || mode === 'Walking') {
            var location1Latlng = scope.trip[placeIndex - 1].latlng;
            var location1 = location1Latlng.lng + ',' + location1Latlng.lat;
            var location2 = place.latlng.lng + ',' + place.latlng.lat;
            var url = 'http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?token=EXY_TTPj6QfZsxahwn6gEm8NK48HjeIK20pJflywiDj_e6mCwcBNz3xEN9BOGQvfrCHfTKnbbbzK-v_TUuH3ytCM3lo4fspAI62eZrMuSKu8kTjdA6vrQkpQApzyHPZVeupk-cFr7WGG0651YdT6Jw..&stops=' + location1 + ';' + location2 + '&f=json';
            console.log('car url', url);
            $http.get(url)
              .success(function(data) {
                console.log('car', data);
                if (data.error) {
                  scope.trip[placeIndex].path.drawing = false;
                  return scope.$emit('alert', {
                    icon: 'cancel-circled',
                    message: 'Unable to retrieve route.' + data.error.details.join('; '),
                    fade: 7000
                  });
                }
                mapCtrl.addFeatures('MultiLineString', data.routes.features[0].attributes, data.routes.features[0].geometry.paths, bounds)
                  .then(function(featureId) {
                    console.log('added feature!!');
                    scope.trip[placeIndex].path.drawing = false;
                    scope.trip[placeIndex].path.featureId = featureId;
                    mapCtrl.refreshGeojson(); // in case of edit
                  });
              });
          } else if (mode === 'Flying' || mode === 'Ferry/Boat') {
            var arcGenerator = new arc.GreatCircle(start, end, {
              'name': 'Flight'
            });
            var line = arcGenerator.Arc(100, {
              offset: 10
            });
            console.log('FLIGHT', line);
            mapCtrl.addFeatures('LineString', line.properties, line.geometries[0].coords, bounds)
              .then(function(featureId) {
                console.log('added FLIGHT PATH!!');
                scope.trip[placeIndex].path.drawing = false;
                scope.trip[placeIndex].path.featureId = featureId;
                mapCtrl.refreshGeojson(); // in case of edit
              });
          }
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