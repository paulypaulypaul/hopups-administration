'use strict';

describe('Directive: actionHtmlReplace', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<action-html-replace></action-html-replace>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the actionHtmlReplace directive');
  }));
});
