'use strict';

describe('Controller: ActioneditorCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ActioneditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActioneditorCtrl = $controller('ActioneditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
