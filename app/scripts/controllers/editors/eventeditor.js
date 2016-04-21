'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:EventEditorCtrl
 * @description
 * # EventEditorCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('EventEditorCtrl', ['$scope', 'hopups', '$q', function ($scope, hopups, $q) {

        this.eventTypes = [
          {display: 'click', value: 'click', code: 'click'},
          {display: 'mouseover', value: 'mouseover', code: 'mouseover'},
          {display: 'initialpageload', value: 'initialpageload', code: 'initialpageload'},
          {display: 'eventfired', value: 'eventfired', code: 'eventfired'}
        ];

        this.add = function(site) {
          //we check if the dropdown has been used to change the event value
          if (site.selected.event && site.selected.event.value){
            site.selected.event = site.selected.event.value;
          }

          //set site id for the event here - peraps we should find a better way
          site.selected.siteId = site.siteId;

          hopups.update(site.selected, 'events').then(function(){
              //reloading here is daft we will stop this
              hopups.fetch($scope.site.siteId, 'events').then( function(events) {
                site.events.length =0; // Cheeky way to empty the array.
                Array.prototype.push.apply($scope.site.events, events);
              });
          });

        }

  }]);
