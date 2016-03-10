'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the adminApp
 */
 angular.module('adminApp')
   .controller('UserCtrl', [ '$scope', '$interval', 'hopups', '$stateParams', function ($scope, $interval, hopups, $stateParams) {

     $scope.site = {
       siteId: $stateParams.siteId,
       siteUsers: [],
       events: []
     };

     function refresh() {
       hopups.fetch($scope.site.siteId, 'siteuser').then( function(siteUsers) {
         $scope.site.siteUsers.length = 0; // Cheeky way to empty the array.
         Array.prototype.push.apply($scope.site.siteUsers, siteUsers);
       });
       hopups.fetch($scope.site.siteId, 'events').then( function(events) {
         $scope.site.events.length =0; // Cheeky way to empty the array.
         Array.prototype.push.apply($scope.site.events, events);
       });
     }

     refresh();

     $interval(refresh, 5000);

     this.getEventString = function(id){
           var events = $scope.site.events;
           for (var event in events){
             if (events[event]._id == id){
               return events[event].name;
             }
           }
           return 'not found';
         }

  }]);
