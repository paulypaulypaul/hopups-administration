'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:hopupChart
 * @description
 * # hopupChart
 */
angular.module('adminApp')
  .directive('hopupChart', function () {
    return {
      restrict: 'E',
      scope: {
        site: '=site',
        hopup: '=hopup',
        simple: '=simple',
        timeout: '=timeout'
      },
      controller: 'HopupChartCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/charts/hopupchart.html'
    };
  });
