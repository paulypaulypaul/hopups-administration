'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:eventEditor
 * @description
 * # eventEditor
 */
angular.module('adminApp')
  .directive('eventEditor', function () {
    return {
      restrict: 'E',
      scope: {
        site: '=site'
      },
      controller: 'EventEditorCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/eventeditor.html'
    };
  });
