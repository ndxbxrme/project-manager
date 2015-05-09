'use strict';

describe('Directive: interpretDate', function () {

  // load the directive's module and view
  beforeEach(module('pApp'));
  beforeEach(module('components/interpret-date/interpret-date.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<interpret-date></interpret-date>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the interpretDate directive');
  }));
});