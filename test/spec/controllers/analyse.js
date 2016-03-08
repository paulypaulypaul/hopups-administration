'use strict';

describe('Controller: AnalyseCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var AnalyseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnalyseCtrl = $controller('AnalyseCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
