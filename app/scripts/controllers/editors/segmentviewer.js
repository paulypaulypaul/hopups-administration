'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:EditorsSegmentviewerCtrl
 * @description
 * # EditorsSegmentviewerCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('SegmentViewerCtrl', function ($scope) {
    var vm = this;

    var segments = $scope.site.segments;
    for (var segment in segments){
      if (segments[segment]._id == $scope.segment){
        vm.segment =  segments[segment];
      }
    }

  });
