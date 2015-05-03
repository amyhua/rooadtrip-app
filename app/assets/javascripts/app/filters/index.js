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
  .filter('days', function() {
    return function(firstDate, secondDate) {
      if (!firstDate || !secondDate) {
        return '';
      }
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

      var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

      return diffDays || '';
    }
  })