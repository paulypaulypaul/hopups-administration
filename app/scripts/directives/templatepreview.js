'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:templatePreview
 * @description
 * # templatePreview
 */
angular.module('adminApp')
  .directive('templatePreview', function () {
      return {
        restrict: 'E',
        scope: {
          site: '=site'
        },
        controller: 'TemplatePreviewCtrl',
        controllerAs: 'vm',
        templateUrl: 'views/viewers/templatepreview.html'
      };
  });

angular.module('adminApp')
  .directive('templatePreviewFrame', function($compile) {
    return function($scope, $element) {
      var $body = angular.element($element[0].contentDocument.body),
          template  = $compile('<template-preview site="site" flex layout></template-preview>')($scope);
      $body.append(template);
    };
  });
