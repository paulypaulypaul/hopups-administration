'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:segmenteditor
 * @description
 * # segmenteditor
 */
angular.module('adminApp')
  .directive('segmentEditor', function () {
    return {
      restrict: 'E',
      scope: {
        site: '=site'
      },
      controller: 'SegmentEditorCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/editors/segmenteditor.html'
    };
  });
