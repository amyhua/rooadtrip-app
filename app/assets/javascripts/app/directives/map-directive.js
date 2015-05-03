angular.module('App.directives')
  .directive('map', function($compile, $q, $timeout, leafletBoundsHelpers) {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        trip: '=',
        map: '=',
        geojson: '=',
        pins: '=?'
      },
      controller: function($scope) {

        function scrollItineraryIntoView(offset) {
          $('.itinerary').animate({
            scrollTop: offset.top
          });
        }

        this.fitMapBounds = function(bounds) {
          if (!angular.isArray(bounds)) {
            bounds = L.latLngBounds(bounds._southWest, bounds._northEast);
          }
          $scope.map.fitBounds(bounds);
        };

        this.removeMarker = function(marker) {
          if (!marker) return;
          $scope.map.removeLayer(marker);
        };

        this.addLocation = function(pinId) {
          if (!pinId) return;
          this.addMarker($scope.pins[pinId]);
        };

        this.removeLocation = function(pinId) {
          if (!pinId) return;
          $scope.map.removeLayer($scope.map.pins[pinId]);
        };

        this.addMarker = function(marker) {
          if (!marker) return;
          $scope.map.addLayer(marker);
          marker.on('click', function(e) {
            // scroll
            var layer = e.target;
          });
        }

        this.replaceMarker = function(oldMarker, newMarker) {
          this.removeMarker(oldMarker);
          this.addMarker(newMarker);
        };

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