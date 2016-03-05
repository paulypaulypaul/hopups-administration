'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SitesCtrl
 * @description
 * # SitesCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('SitesCtrl', ['$scope', '$rootScope', 'hopups', function ($scope, $rootScope, hopups) {
    var vm = this;
    vm.sites = [];

    function refresh() {
      hopups.fetchSites().then( function(sites) {
        vm.sites.length =0; // Cheeky way to empty the array.
        Array.prototype.push.apply(vm.sites, sites);
      });
    }
    refresh();

    $scope.startEditing =  function (siteId) {
      $location.path("/site/" + siteId);
    };

    $scope.dashboard =  function (siteId) {
      $location.path("/hopups-dashboard/" + siteId);
    };

  }]);
