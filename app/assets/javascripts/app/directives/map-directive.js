angular.module('App.directives')
  .directive('map', function($compile, $q, $timeout, leafletBoundsHelpers) {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        trip: '=',
        map: '=',
        geojson: '=',
        pins: '='
      },
      controller: function($scope) {

        this.fitMapBounds = function(bounds) {
          if (!angular.isArray(bounds)) {
            bounds = L.latLngBounds(bounds._southWest, bounds._northEast);
          }
          $scope.map.fitBounds(bounds);
        };

        this.addMarker = function(marker) {
          if (!marker) return;
          marker.id = Date.now();
          $scope.pins[marker.id] = marker;
          this.addLocation(marker.id);
          // TODO promises
          return marker.id;
        };

        this.removeMarker = function(marker) {
          if (!marker) return;
          if (!marker.id) {
            throw new Error('Expected marker.id');
          }
          this.removeLocation(marker.id);
        };

        this.addLocation = function(pinId) {
          if (!pinId) return;
          var marker = $scope.pins[pinId];
          if (!marker) {
            throw new Error('Expected an existing pin');
          }
          $scope.map.addLayer(marker);
          marker.on('click', function(e) {
            // scroll
            var layer = e.target;
            debugger
          });
        };

        this.removeLocation = function(pinId) {
          if (!pinId) return;
          $scope.map.removeLayer($scope.map.pins[pinId]);
          delete $scope.pins[pinId];
        };

        this.replaceLocation = function(currentPin, newPin) {
          this.removeLocation(currentPin);
          this.addMarker(newPin);
        };

        this.replaceMarker = function(oldMarker, newMarker) {
          this.removeMarker(oldMarker);
          return this.addMarker(newMarker);
        };

        this.getMarker = function(pinId) {
          return $scope.pins[pinId];
        }

        this.addFeatures = function(geojsonType, properties, coordinates, bounds) {
          if (!coordinates) {
            throw new Error('Undefined coordinates');
          }
          var deferred = $q.defer();
          var featureId = Date.now().toString();
          var numLayers = _.keys($scope.geojson._layers).length;
          var geojsonFeature = {
            type: geojsonType,
            properties: _.defaults(properties, {
              featureId: featureId
            }),
            coordinates: coordinates
          };
          console.log('addFeatures', geojsonFeature);

          $scope.geojson.addData(geojsonFeature);

          if (_.keys($scope.geojson._layers).length > numLayers) {
            if (bounds) {
              $scope.map.fitBounds(bounds).zoomOut(1);
            }
            deferred.resolve(featureId);
            console.log('map addFeatures', $scope.map);
          } else {
            deferred.reject('Could not add geojson layer');
          }
          return deferred.promise;
        };

        this.refreshGeojson = function(idx) {
          var pathPlaces = _.filter($scope.trip, function(place) {
            return place.path && place.path.featureId;
          });
          var featureIds = _.map(pathPlaces, function(place) {
            return place.path.featureId;
          });
          if (featureIds.length) {
            var keptLayers = _.filter($scope.geojson._layers, function(layer) {
              console.log('REFRESH', layer.feature.geometry.properties.featureId);
              return _.contains(featureIds, layer.feature.geometry.properties.featureId);
            });
            var keptFeatures = _.pluck(keptLayers, 'feature');
            $scope.geojson.clearLayers();
            $scope.geojson.addData(keptFeatures);
          } else {
            $scope.geojson.clearLayers();
          }
        }
      },
      link: function(scope, element, attrs) {
        console.log('map', scope);
        var content = $compile('<itinerary></itinerary>')(scope);
        element.find('.leaflet-top.leaflet-left').append(content);

        function sizeMap() {
          $timeout(function() {
            var height = $('.map-board').outerHeight(true);
            $(element).css('height', height);
            scope.$emit('resetMap');
          })
        }
        $(window).on('resize', function() {
          sizeMap();
        });
        sizeMap();

        // link up stored paths to trip markers
      }
    };
  });