'use strict';

describe('Service: priority', function () {

  // load the service's module
  beforeEach(module('pApp'));

  // instantiate service
  var priority;
  beforeEach(inject(function (_priority_) {
    priority = _priority_;
  }));

  it('should do something', function () {
    expect(!!priority).toBe(true);
  });

});
