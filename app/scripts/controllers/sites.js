'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SitesCtrl
 * @description
 * # SitesCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('SitesCtrl', ['$scope', '$rootScope', 'hopups', '$mdDialog', '$cookies', function ($scope, $rootScope, hopups, $mdDialog, $cookies) {
    var vm = this;
    vm.sites = [];

    vm.tour2 = 'Now click the spanner to configure your site';
    $scope.currentStep = 1;

    function refresh() {
      hopups.fetchSites().then( function(sites) {
        vm.sites.length =0; // Cheeky way to empty the array.
        Array.prototype.push.apply(vm.sites, sites);
        if (sites.length > 0){
          $cookies.put('myTour', 1);
        }
      });

    }
    refresh();

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
                hopups.updateSite({
                  name: $scope.newSite.name,
                  description: $scope.newSite.description,
                  phoneNumbers: $scope.newSite.phoneNumbers,
                })
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
