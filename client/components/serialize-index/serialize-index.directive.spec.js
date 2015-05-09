'use strict';

describe('Directive: serializeIndex', function () {

  // load the directive's module
  beforeEach(module('pApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<serialize-index></serialize-index>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the serializeIndex directive');
  }));
});