'use strict';

describe('Directive: hopupeditor', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hopupeditor></hopupeditor>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the hopupeditor directive');
  }));
});
