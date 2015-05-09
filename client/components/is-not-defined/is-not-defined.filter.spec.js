'use strict';

describe('Filter: isNotDefined', function () {

  // load the filter's module
  beforeEach(module('pApp'));

  // initialize a new instance of the filter before each test
  var isNotDefined;
  beforeEach(inject(function ($filter) {
    isNotDefined = $filter('isNotDefined');
  }));

  it('should return the input prefixed with "isNotDefined filter:"', function () {
    var text = 'angularjs';
    expect(isNotDefined(text)).toBe('isNotDefined filter: ' + text);
  });

});
