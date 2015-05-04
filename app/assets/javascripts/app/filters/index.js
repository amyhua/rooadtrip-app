angular.module('App.filters')
  .filter('toDate', function($filter) {
    return function(dateString) {
      if (!dateString) return;
      var currentYear = new Date().getFullYear().toString();
      var isCurrentYear = dateString.match(/\d{4}/)[0] === currentYear;

      if (dateString.length === 10) {
        // date only
        return $filter('date')(dateString, 'EEE MMM d' + (!isCurrentYear ? ', y' : ''));
      }
      return $filter('date')(dateString, 'EEE MMM d,' + (!isCurrentYear ? ' y' : '') + ' h:mma');
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
      firstDate = _.isString(firstDate) ? new Date(firstDate) : firstDate;
      secondDate = _.isString(secondDate) ? new Date(secondDate) : secondDate;
      var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))) + 1;
      return diffDays || '';
    }
  })