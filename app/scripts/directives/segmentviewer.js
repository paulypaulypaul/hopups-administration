'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:segmentviewer
 * @description
 * # segmentviewer
 */
angular.module('adminApp')
  .directive('segmentViewer', function () {
    return {
      restrict: 'E',
      scope: {
        segment: '=segment',
        site: '=site'
      },
      controller: 'SegmentViewerCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/segmentviewer.html'
    };
  });
