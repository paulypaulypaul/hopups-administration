'use strict';

describe('Controller: EventEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var EventeditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventeditorCtrl = $controller('EventEditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
