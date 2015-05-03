angular.module('App.controllers')
  .controller("dashboardCtrl", function($scope, $http, $timeout, MapService) {
    'use strict';

    this.user = {
      name: 'Amy Hua',
      title: 'Software Engineer',
      img: 'https://mug0.assets-yammer.com/mugshot/images/150x150/Z9402TZMXpzgWP2LH8009FVwqH5tL1VG'
    };

    this.showAgenda = false;

    // outta local storage if any
    var tripId = JSON.parse(localStorage.getItem('tripId'));
    console.log('local storage', tripId);
    if (!tripId) {
      this.trip = [];
    } else {
      this.trip = tripId.trip;
    }
    // records in form { featureType(marker|path), name, description, etc... }

    var center = [40.7127, -74.0039];
    var map;
    this.map = map = L.map('map', {
      zoomControl: false,
      doubleClickZoom: false,
      attributionControl: false,
      scrollWheelZoom: false
    }).setView(center, 11);

    this.geojson = L.geoJson().addTo(map);

    $scope.$watchCollection(function() {
      return this.geojson._layers;
    }.bind(this), function(layers) {
      console.log('layers changed', layers.length, layers);
      console.log('TODO: save layers');
    });

    $scope.$on('resetMap', function() {
      map._onResize();

    });

    new L.Control.Zoom({
      position: 'topright'
    }).addTo(map);

    L.esri.basemapLayer('Gray').addTo(map);

    // var pointData = L.esri.featureLayer('http://services5.arcgis.com/wppiJCtx4Qz00SlV/arcgis/rest/services/Rooadtrip_Point_Data/')
    //   .addTo(map);

    // var service = L.esri.Services.featureLayer({
    //   url: 'http://services5.arcgis.com/wppiJCtx4Qz00SlV/arcgis/rest/services/Rooadtrip_Point_Data/'
    // });

    var feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122, 45]
      },
      properties: {
        name: 'Hello World'
      }
    };

    // service.addFeature(feature, function(error, response) {
    //   if (error) {
    //     console.log('error creating feature' + error.message);
    //   } else {
    //     console.log('Successfully created feature with id ' + response.objectId);
    //   }
    // });

    // ----- create marker by address -----

    var searchControl = L.esri.Geocoding.Controls.geosearch({
      collapseAfterResult: false,
      allowMultipleResults: false,
      placeholder: 'Add a Destination',
      title: 'Add a Destination',
      expanded: true
    }).addTo(map);

    map.pins = {};

    // $timeout(function getBounds() {
    //   console.log('fit bounds');
    //   var group = new L.featureGroup(_.values(this.map.pins));

    //   map.fitBounds(group.getBounds());
    // }.bind(this));

    // map of existing map pins by pin ID

    // create an empty layer group to store the results and add it to the map
    var destinations = new L.LayerGroup();
    destinations.addTo(map);

    searchControl.on('results', function(data) {
      console.log('search results', data);
      $('#no-results').text('');
      if (data.results.length > 1) {
        console.log('multiple search results, limit to 1');
      }
      if (data.results.length === 0) {
        $('#no-results').text('No results found');
        return;
      }
      var result = data.results[0];
      // TODO: save to ArcGis Feature Layer
      map.fitBounds(result.bounds);

      // save to trip
      // TODO: save new destination to trip
      this.trip.push({
        address: result.text,
        name: result.properties.PlaceName || result.properties.Match_addr,
        author: this.user.name,
        featureType: 'place',
        bounds: result.bounds,
        latlng: result.latlng
      });
      $scope.$apply();
    }.bind(this));

    function saveTripLocally(trip) {
      // save in local storage as backup
      trip = _.cloneDeep(trip);
      trip = _.map(trip, function(place) {
        delete place.pin;
        return place;
      });
      tripId = tripId || {};

      var data = {
        id: tripId.id || 'trip' + Date.now().toString(),
        trip: trip
      };
      console.log('STORE TRIP', data);
      localStorage.setItem('tripId', JSON.stringify(data));
      console.log('STORED', localStorage.getItem('tripId'));
    }

    $scope.$watchCollection(function() {
      return this.trip;
    }.bind(this), function updateTrip() {
      if (!this.trip.length) return;
      console.log('posting...');
      saveTripLocally(this.trip);
      $http.post('http://74.73.85.220/RooadTrip/api/Trip/SaveTrip', this.trip)
        .success(function() {
          // TODO
        }.bind(this))
        .error(function(e) {
          $scope.$emit('alert', {
            icon: 'attention',
            message: 'Could not save trip',
            fade: 5000
          });
          console.log('Save error', e);
        }.bind(this));
    }.bind(this));

    // var drawControl = MapService.drawControl(map);

    // http://services5.arcgis.com/wppiJCtx4Qz00SlV/arcgis/rest/services/Rooadtrip_Point_Data/FeatureServer/0

  });