'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:hopupeditor
 * @description
 * # hopupeditor
 */
angular.module('adminApp')
  .directive('hopupEditor', function () {
    return {
      restrict: 'E',
      scope: {
        site: '=site'
      },
      controller: 'HopupEditorCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/hopupeditor.html'
    };
  });
