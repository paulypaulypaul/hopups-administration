'use strict';

describe('Controller: SiteeditorCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var SiteeditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SiteeditorCtrl = $controller('SiteeditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
