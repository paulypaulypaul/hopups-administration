'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:siteeditor
 * @description
 * # siteeditor
 */
angular.module('adminApp')
  .directive('siteEditor', function () {
    return {
      restrict: 'E',
      scope: {
        site: '=site'
      },
      controller: 'SiteEditorCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/editors/siteeditor.html'
    };
  });
