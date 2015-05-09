'use strict';

describe('Directive: notes', function () {

  // load the directive's module and view
  beforeEach(module('pApp'));
  beforeEach(module('components/notes/notes.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<notes></notes>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the notes directive');
  }));
});