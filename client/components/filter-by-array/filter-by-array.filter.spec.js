'use strict';

describe('Filter: filterByArray', function () {

  // load the filter's module
  beforeEach(module('pApp'));

  // initialize a new instance of the filter before each test
  var filterByArray;
  beforeEach(inject(function ($filter) {
    filterByArray = $filter('filterByArray');
  }));

  it('should return the input prefixed with "filterByArray filter:"', function () {
    var text = 'angularjs';
    expect(filterByArray(text)).toBe('filterByArray filter: ' + text);
  });

});
