'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('HeaderCtrl', ['$scope', '$rootScope', '$mdSidenav', 'ENV', '$cookies', function ($scope, $rootScope, $mdSidenav, ENV, $cookies) {
    var vm = this;

    $scope.my_address = window.location.protocol + "//" +window.location.host + "/";
    $scope.facebookAppId = ENV.facebookAppId;

    vm.tour1 = 'Welcome to HopUps. yo';

    var curStep = $cookies.get('myTour');
    if(typeof curStep === 'string'){
      curStep = parseInt(curStep);
    }

     $scope.currentStep = curStep || 0;

     $scope.postTourCallback = function() {
       console.log('tour closes');
     };

     $scope.tourCompleteCallback = function() {
       console.log('tour completed');
     }

     $scope.postStepCallback = function() {
       console.log('Tour - Update Step', $scope.currentStep);
       $cookies.put('myTour', $scope.currentStep);
     };

    this.toggleList = function() {
      $mdSidenav('left').toggle();
    };

  }]);
