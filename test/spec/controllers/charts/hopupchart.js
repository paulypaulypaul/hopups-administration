'use strict';

describe('Controller: ChartsHopupchartCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ChartsHopupchartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChartsHopupchartCtrl = $controller('ChartsHopupchartCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
