'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('HeaderCtrl', ['$scope', '$rootScope', '$mdSidenav', 'ENV', function ($scope, $rootScope, $mdSidenav, ENV) {
    $scope.my_address = window.location.protocol + "//" +window.location.host + "/";
    $scope.facebookAppId = ENV.facebookAppId;

    this.toggleList = function() {
      $mdSidenav('left').toggle();
    };

  }]);
