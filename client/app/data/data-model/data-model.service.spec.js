'use strict';

describe('Service: dataModel', function () {

  // load the service's module
  beforeEach(module('pApp'));

  // instantiate service
  var dataModel;
  beforeEach(inject(function (_dataModel_) {
    dataModel = _dataModel_;
  }));

  it('should do something', function () {
    expect(!!dataModel).toBe(true);
  });

});
