'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:actionHtml
 * @description
 * # actionHtml
 */
  angular.module('adminApp')
    .directive('actionHtml', function () {

      var controller = ['$scope', function ($scope) {
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
          responsepredefinedtemplateappend: '=responsepredefinedtemplateappend',
          responsepredefinedtemplatecolor: '=responsepredefinedtemplatecolor'
        },
        controller: controller,
        controllerAs: 'vm',
        templateUrl: '/views/editors/actionhtml.html'
      };
    });
