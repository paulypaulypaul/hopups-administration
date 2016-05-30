'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:HopupsCtrl
 * @description
 * # HopupsCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('HopupsCtrl', ['$scope', '$stateParams', 'hopups', function ($scope, $stateParams, hopups) {

    $scope.site = {
      siteId: $stateParams.siteId,
      events: [],
      segments: [],
      actions: [],
      hopups: [],
      sessiondata: [],
      actionsessiondata: [],
      actionsessiondata2: [],
      actionsessiondatatimeseries: [],
      selectedHopup: null
    };

    function refresh() {
      hopups.fetch($scope.site.siteId, 'sessiondata').then( function(sessiondata) {
        $scope.site.sessiondata.length = 0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.sessiondata, sessiondata);
      });
      hopups.fetch($scope.site.siteId, 'actionsessiondata').then( function(actionsessiondata) {
        $scope.site.actionsessiondata.length = 0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.actionsessiondata, actionsessiondata);
      });
      hopups.fetch($scope.site.siteId, 'actionsessiondatatimeseries').then( function(actionsessiondatatimeseries) {
        $scope.site.actionsessiondatatimeseries.length = 0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.actionsessiondatatimeseries, actionsessiondatatimeseries);
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

    var createNewHopup = function(){
      //creates new hopup
    }

  }]);
