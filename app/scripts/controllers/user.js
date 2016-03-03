'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('UserCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var donkey = 1;
    if (donkey){
      var sep = true;
    }

  });
