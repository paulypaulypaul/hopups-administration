'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:actioneditor
 * @description
 * # actioneditor
 */
angular.module('adminApp')
  .directive('actionEditor', function () {
    return {
      restrict: 'E',
      scope: {
        site: '=site'
      },
      controller: 'ActionEditorCtrl',
      controllerAs: 'vm',
      templateUrl: '/views/editors/actioneditor.html'
    };
  });
