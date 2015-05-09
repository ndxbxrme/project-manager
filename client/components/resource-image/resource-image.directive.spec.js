'use strict';

describe('Directive: resourceImage', function () {

  // load the directive's module and view
  beforeEach(module('pApp'));
  beforeEach(module('components/resource-image/resource-image.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<resource-image></resource-image>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the resourceImage directive');
  }));
});