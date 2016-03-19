'use strict';

describe('Controller: ViewersTemplatepreviewCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ViewersTemplatepreviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewersTemplatepreviewCtrl = $controller('ViewersTemplatepreviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
