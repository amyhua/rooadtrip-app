angular.module('App.directives')
  .directive('place', function($http) {
    return {
      restrict: 'EAC',
      $scope: {
        place: '=',
        pins: '='
      },
      require: '^map',
      templateUrl: 'place.html',
      link: function($scope, element, attrs, mapCtrl) {
        console.log('place making');

        // add marker
        function labelClassName(place) {
          var className;
          if (place.path && place.path.transitMode) {
            className = place.path.transitMode.replace(/\//g, '').replace(/\s/g, '');
          }
          return className;
        }

        // hack
        var placeIndex = _.indexOf($scope.$parent.trip, $scope.place);
        var marker = L.marker($scope.place.latlng, {
          icon: new L.Icon.Label.Default({
            labelText: $scope.place.name,
            labelClassName: labelClassName($scope.place) + ' ' + 'index-' + (placeIndex + 1)
          })
        });

        $scope.place.pinId = mapCtrl.addMarker(marker);

        $scope.$watch('place.path.transitMode', function(path) {
          if (!path) return;
          // hack
          var index = _.indexOf($scope.$parent.trip, $scope.place);
          $scope.chooseTransitMode(index, $scope.place, $scope.place.path.transitMode);
        }, true);

        function drawDefaultPath(start, end, bounds) {
          var arcGenerator = new arc.GreatCircle(start, end, {
            'name': 'Flight'
          });
          var line = arcGenerator.Arc(100, {
            offset: 10
          });
          mapCtrl.addFeatures('LineString', line.properties, line.geometries[0].coords, bounds)
            .then(function(featureId) {
              $scope.place.path.drawing = false;
              $scope.place.path.featureId = featureId;
              mapCtrl.refreshGeojson(); // in case of edit
            });
        }

        $scope.chooseTransitMode = function(placeIndex, place, mode) {
          console.log('chooseTransitMode', placeIndex, mode, place);
          place = place || $scope.place;

          $scope.place.path = {
            transitMode: mode
          };

          $scope.trip[placeIndex].path.editable = false;
          $scope.trip[placeIndex].path.drawing = true;
          var start = {
            x: $scope.trip[placeIndex - 1].latlng.lng,
            y: $scope.trip[placeIndex - 1].latlng.lat
          };
          var end = {
            x: $scope.trip[placeIndex].latlng.lng,
            y: $scope.trip[placeIndex].latlng.lat
          };
          var bounds = [
            [start.y, start.x],
            [end.y, end.x]
          ];

          if (mode === 'Car/Taxi' || mode === 'Biking' || mode === 'Walking') {
            var location1Latlng = $scope.trip[placeIndex - 1].latlng;
            var location1 = location1Latlng.lng + ',' + location1Latlng.lat;
            var location2 = place.latlng.lng + ',' + place.latlng.lat;
            var url = 'http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?token=EXY_TTPj6QfZsxahwn6gEm8NK48HjeIK20pJflywiDj_e6mCwcBNz3xEN9BOGQvfrCHfTKnbbbzK-v_TUuH3ytCM3lo4fspAI62eZrMuSKu8kTjdA6vrQkpQApzyHPZVeupk-cFr7WGG0651YdT6Jw..&stops=' + location1 + ';' + location2 + '&f=json';
            console.log('car url', url);
            $http.get(url)
              .success(function(data) {
                console.log('car', data);
                if (data.error) {
                  if ($scope.place.path) {
                    $scope.place.path.drawing = false;
                  }
                  $scope.trip[placeIndex].path.drawing = false;
                  return $scope.$emit('alert', {
                    icon: 'attention',
                    message: 'Unable to retrieve route.' + data.error.details.join('; '),
                    fade: 7000
                  });
                }
                mapCtrl.addFeatures('MultiLineString', data.routes.features[0].attributes, data.routes.features[0].geometry.paths, bounds)
                  .then(function(featureId) {
                    console.log('added feature!!');
                    $scope.trip[placeIndex].path.drawing = false;
                    $scope.trip[placeIndex].path.featureId = featureId;
                    mapCtrl.refreshGeojson(); // in case of edit
                  });
              })
              .error(function(error) {
                var message = '';
                if (!navigator.onLine) {
                  message = 'You appear to be offline. ';
                }
                message += mode + ' routes and directions from ' +
                  $scope.trip[placeIndex - 1].name + ' to ' + $scope.place.name + ' could not be retrieved. A generic path will be used instead.';
                console.log('error in GET to route.arcgis.com', error);
                $scope.trip[placeIndex].path.drawing = false;
                $scope.$emit('alert', {
                  icon: 'attention',
                  message: message,
                  fade: 10 * 1000
                });
                drawDefaultPath(start, end, bounds);
              });
          } else if (mode) {
            drawDefaultPath(start, end, bounds);
          } else {
            console.error('No path', place, mode);
          }

          // change transit mode icon on label
          var marker = L.marker($scope.place.latlng, {
            icon: new L.Icon.Label.Default({
              labelText: $scope.place.name,
              labelClassName: labelClassName($scope.place) + ' ' + 'index-' + (placeIndex + 1)
            })
          });
          var currentMarker = mapCtrl.getMarker($scope.place.pinId);
          var newPinId = mapCtrl.replaceMarker(currentMarker, marker);
          $scope.place.pinId = newPinId;
        };

        $scope.$on('$destroy', function() {
          mapCtrl.removeLocation($scope.place.pinId);
        });
      }
    };
  });