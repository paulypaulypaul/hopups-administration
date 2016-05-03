'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:actionHtmlReplace
 * @description
 * # actionHtml
 */
  angular.module('adminApp')
    .directive('actionHtmlReplace', function () {

      var controller = ['$scope', 'hopups', function ($scope, hopups) {
        $scope.awesomeThings = [
          'HTML5 Boilerplate',
          'AngularJS',
          'Karma'
        ];
      }];

      return {
        restrict: 'E',
        scope: {
          site: '=site',
          responsedatalocation: '=responsedatalocation',
          responsepredefinedtemplatereplace: '=responsepredefinedtemplatereplace',
          responsepredefinedtemplatecolor: '=responsepredefinedtemplatecolor'
        },
        controller: controller,
        controllerAs: 'vm',
        templateUrl: '/views/editors/actionhtmlreplace.html'
      };
    });
