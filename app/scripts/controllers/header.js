'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('HeaderCtrl', ['$scope', '$mdSidenav', 'ENV', function ($scope, $mdSidenav, ENV) {
    $scope.my_address = window.location.protocol + "//" +window.location.host + "/";
    this.toggleList = function() {
      $mdSidenav('left').toggle();
    };

    console.log(ENV.apiEndPoint)

  }]);
