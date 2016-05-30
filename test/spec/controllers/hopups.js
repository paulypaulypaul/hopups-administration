'use strict';

describe('Controller: HopupsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var HopupsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HopupsCtrl = $controller('HopupsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
