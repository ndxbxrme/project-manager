'use strict';

describe('Directive: minicolors', function () {

  // load the directive's module
  beforeEach(module('pApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<minicolors></minicolors>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the minicolors directive');
  }));
});