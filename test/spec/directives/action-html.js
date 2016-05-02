'use strict';

describe('Directive: actionHtml', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<action-html></action-html>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the actionHtml directive');
  }));
});
