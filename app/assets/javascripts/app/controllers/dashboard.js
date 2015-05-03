angular.module('App.controllers')
  .controller("dashboardCtrl", function($scope, MapService) {
    'use strict';

    this.user = {
      name: 'Amy Hua',
      title: 'Software Engineer',
      img: 'https://mug0.assets-yammer.com/mugshot/images/150x150/Z9402TZMXpzgWP2LH8009FVwqH5tL1VG'
    };

    this.showAgenda = false;
    this.trip = [];
    // records in form { featureType(marker|path), name, description, etc... }

    var center = [37.75, -122.23];
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false
    }).setView(center, 10);

    new L.Control.Zoom({
      position: 'topright'
    }).addTo(map);

    L.esri.basemapLayer('Gray').addTo(map);

    var pointData = L.esri.featureLayer('http://services5.arcgis.com/wppiJCtx4Qz00SlV/arcgis/rest/services/Rooadtrip_Point_Data/')
      .addTo(map);

    var marker = L.marker(center, {
      draggable: true
    }).addTo(map);

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
      destinations.addLayer(L.marker(result.latlng));
      // TODO: save to ArcGis Feature Layer
      map.fitBounds(result.bounds);

      // save to trip
      // TODO: save new destination to trip
      this.trip.push({
        address: result.text,
        name: result.properties.PlaceName,
        author: this.user.name,
        featureType: 'place'
      });
      $scope.$apply();
    }.bind(this));

    $scope.$watchCollection(function() {
      return this.trip;
    }.bind(this), function updateTrip() {
      console.log('TODO save/update trip to db');
    });

    // var drawControl = MapService.drawControl(map);

    // http://services5.arcgis.com/wppiJCtx4Qz00SlV/arcgis/rest/services/Rooadtrip_Point_Data/FeatureServer/0

  });