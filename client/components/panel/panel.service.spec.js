'use strict';

describe('Service: panel', function () {

  // load the service's module
  beforeEach(module('pApp'));

  // instantiate service
  var panel;
  beforeEach(inject(function (_panel_) {
    panel = _panel_;
  }));

  it('should do something', function () {
    expect(!!panel).toBe(true);
  });

});
