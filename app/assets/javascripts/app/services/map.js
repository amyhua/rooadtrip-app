angular.module('App.services')
  .service('MapService', function authenticationResource() {
    this.searchControl = function(map) {
      return new L.esri.Geocoding.Controls.Geosearch().addTo(map);
    };

    this.drawControl = function(map) {
      // ---- draw control ----

      // Initialise the draw control and pass it the FeatureGroup of editable layers
      var drawnItems = new L.FeatureGroup();
      drawnItems.addTo(map);
      var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems
        }
      });
      map.addControl(drawControl);

      map.on('draw:created', function(e) {
        console.log(e.type);
        // Triggered when layers in the FeatureGroup, initialised with the plugin, have been edited and saved.
        var type = e.layerType,
          layer = e.layer;

        if (type === 'marker') {
          // Do marker specific actions
        }

        // Do whatever else you need to. (save to db, add to map etc)
        map.addLayer(layer);
      });

      map.on('draw:edited', function(e) {
        console.log(e.type);
        var layers = e.target._layers;
        _.each(layers, function(layer) {
          //do whatever you want, most likely save back to db
        });
      });

      map.on('draw:deleted', function(e) {
        console.log(e.type);
        var layers = e.target._layers;
        _.each(layers, function(layer) {
          //do whatever you want, most likely save back to db
        });
      });

      map.on('draw:drawstart', function(e) {
        console.log(e.type);
        var layers = e.target._layers;
        _.each(layers, function(layer) {
          //do whatever you want, most likely save back to db
        });
      });

      map.on('draw:drawstop', function(e) {
        console.log(e.type);
        var layers = e.target._layers;
        _.each(layers, function(layer) {
          //do whatever you want, most likely save back to db
        });
      });

      map.on('draw:editstart', function(e) {
        console.log(e.type);
        var layers = e.target._layers;
        _.each(layers, function(layer) {
          //do whatever you want, most likely save back to db
        });
      });

      map.on('draw:editstop', function(e) {
        console.log(e.type);
        var layers = e.target._layers;
        _.each(layers, function(layer) {
          //do whatever you want, most likely save back to db
        });
      });

      map.on('draw:deletestart', function(e) {
        console.log(e.type);
        var layers = e.target._layers;
        _.each(layers, function(layer) {
          //do whatever you want, most likely save back to db
        });
      });

      map.on('draw:deletestop', function(e) {
        console.log(e.type);
        var layers = e.target._layers;
        _.each(layers, function(layer) {
          //do whatever you want, most likely save back to db
        });
      });

      drawControl.drawnItems = drawnItems;

      return drawControl;
    };

  });