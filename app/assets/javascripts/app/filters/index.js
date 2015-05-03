angular.module('App.filters')
  .filter('toDate', function($filter) {
    return function(dateString) {
      if (!dateString) return;
      if (dateString.length === 10) {
        // date only
        return $filter('date')(dateString, "EEE MMM d, y");
      }
      return $filter('date')(dateString, "EEE MMM d, y h:mma");
    };
  })
  .filter('transit', function() {
    return function(mode) {
      var map = {
        'drive': 'Car/Taxi',
        'fly': 'Flying',
        'bike': 'Biking',
        'walk': 'Walking'
      };
    }
  })