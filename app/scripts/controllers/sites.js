'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SitesCtrl
 * @description
 * # SitesCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('SitesCtrl', ['$scope', '$rootScope', 'hopups', '$mdDialog', function ($scope, $rootScope, hopups, $mdDialog) {
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


    $scope.createNewSite = function() {
      var dlg = $mdDialog.alert({
        templateUrl: 'views/dialogs/newsite.html',
        controller: ['$scope', 'hopups',
        function DialogController($scope,  hopups) {
          $scope.showHints = false;
          $scope.newType= {
            template: "blank"
          };
          $scope.closeDialog= function(create) {
            if(create) {
              if( $scope.newSiteForm.$valid) {
                hopups.updateSite({name: $scope.newSite.name})
                .then(function(typeName) {
                  $mdDialog.hide();
                  refresh();
                });
              }
            } else {
              $mdDialog.hide();
            }
          };
        }]
      });
      $mdDialog.show( dlg );
    };

  }]);
