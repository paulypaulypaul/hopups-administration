'use strict';

describe('Service: hopups', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var hopups;
  beforeEach(inject(function (_hopups_) {
    hopups = _hopups_;
  }));

  it('should do something', function () {
    expect(!!hopups).toBe(true);
  });

});
