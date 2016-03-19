'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ViewersTemplatepreviewCtrl
 * @description
 * # ViewersTemplatepreviewCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('TemplatePreviewCtrl', ['$scope', '$sce', function ($scope, $sce) {
    var vm = this;


  }])
  .filter('unsafe', function($sce) { return $sce.trustAsHtml; });
