angular.module('App.directives')
  .directive('itinerary', function($rootScope) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="leaflet-control"><div class="itinerary">' +
        '<ul><li ng-repeat="place in trip track by $index" class="clearfix">' +
        '<div class="display">' +
        '<span class="icon-marker"></span>' +
        '<span class="name">{{ place.name }}</span>' +
        '<p class="times" ng-show="place.days">{{ place.days }} days</p>' +
        '<p><span class="times" ng-show="place.checkin">{{ place.checkin | date:"EEE MMM d, y h:mma" }}</span>' +
        '<span class="times" ng-show="place.checkout"> until {{ place.checkout | date:"EEE MMM d, y h:mma" }}</span></p>' +
        '<p class="description">{{ place.description }}</p>' +
        '<small class="subtle">Created by {{ place.author }}</small>' +
        '</div>' +
        '<form class="edit">' +
        '<input type="text" ng-model="place.name" class="form-control" id="name" placeholder="Name">' +
        '<textarea ng-model="place.description" class="form-control" placeholder="Description" id="description"></textarea>' +
        '<span><label for="">Check in</label><input class="form-control" type="datetime-local" ng-model="place.checkin"></span>' +
        '<span><label for="">Check out</label><input class="form-control" type="datetime-local" ng-model="place.checkout"></span>' +
        '<div><input type="number" class="form-control days" ng-model="place.days" placeholder="Number of Days"> Days</div>' +
        '<input type="submit" class="pull-right btn btn-primary">' +
        '</form>' +
        '</li></ul></div></div>',
      link: function(scope, element, attrs) {
        console.log('it', scope);

        element.on('submit', 'form', function(e) {
          // TODO: update place in db

          function success() {
            $(e.target).parent().removeClass('editable');
            $rootScope.$emit('alert', {
              icon: 'check-circle',
              message: 'Success!'
            });
          }

          success();
        });

        scope.$watchCollection('trip', function editNewPlace(newTrip, oldTrip) {
          console.log('trip change', newTrip.length, oldTrip.length);
          if (newTrip.length - oldTrip.length === 1) {
            // new place --> open edit form of top
            element.find('.itinerary > ul > li:first-child').addClass('editable');
          }
        }.bind(this));
      }
    }
  })
  .directive('map', function($compile) {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        trip: '='
      },
      link: function(scope, element, attrs) {
        console.log('map', scope);
        var content = $compile('<itinerary></itinerary>')(scope);
        element.find('.leaflet-top.leaflet-left').append(content);
      }
    };
  });