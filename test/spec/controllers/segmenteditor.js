'use strict';

describe('Controller: SegmenteditorCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var SegmenteditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SegmenteditorCtrl = $controller('SegmenteditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
