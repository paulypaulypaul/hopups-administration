'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SiteCtrl
 * @description
 * # SiteCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('SiteCtrl', ['$scope', '$location', '$mdDialog', 'hopups', '$stateParams',
    function ($scope, $location, $mdDialog, hopups, $stateParams) {

    $scope.site = {
      siteId: $stateParams.siteId,
      siteDetails: {},
      events: [],
      segments: [],
      actions: [],
      hopups: [],
      editingEvent: false,
      editingSegment: false,
      editingAction: false,
      selected: null
    };


    function refresh() {
          hopups.fetchSites($scope.site.siteId).then( function(siteDetails) {
            $scope.site.siteDetails = siteDetails;
          });
          hopups.fetch($scope.site.siteId, 'events').then( function(events) {
            $scope.site.events.length =0; // Cheeky way to empty the array.
            Array.prototype.push.apply($scope.site.events, events);
          });
          hopups.fetch($scope.site.siteId, 'segments').then( function(segments) {
            $scope.site.segments.length =0; // Cheeky way to empty the array.
            Array.prototype.push.apply($scope.site.segments, segments);
          });
          hopups.fetch($scope.site.siteId, 'actions').then( function(actions) {
            $scope.site.actions.length =0; // Cheeky way to empty the array.
            Array.prototype.push.apply($scope.site.actions, actions);
          });
          hopups.fetch($scope.site.siteId, 'hopups').then( function(hopups) {
            $scope.site.hopups.length =0; // Cheeky way to empty the array.
            Array.prototype.push.apply($scope.site.hopups, hopups);
          });
        }

        refresh();

        this.remove = function(thing, type){
              hopups.delete(thing, type).then(function(){
                //refreshing is a bit overkill  - spend some time;
                refresh()
              });
            }

            this.duplicate = function(thing, type){
              delete thing._id
              thing.name = thing.name + ' (duplicate)';

              hopups.update(thing, type).then(function(){
                //refreshing is a bit overkill  - spend some time;
                refresh()
              });
            }

            this.showAll = function(type){
              $scope.site.selected = null;
              $scope.site.editing = type;
            }

            this.selectOne = function(item, type) {
              $scope.site.selected = item;
              $scope.site.editing = type;
            };

            this.showSiteDetails = function(){
              $scope.site.selected = null;
              $scope.site.editing = 'site';
            }

            this.shouldDisplay = function(type) {
              return $scope.site.editing === type;
            };

  }]);
