'use strict';

describe('Directive: kanban', function () {

  // load the directive's module and view
  beforeEach(module('pApp'));
  beforeEach(module('components/kanban/kanban.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<kanban></kanban>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the kanban directive');
  }));
});