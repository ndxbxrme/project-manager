'use strict';

describe('Directive: onlineUsers', function () {

  // load the directive's module and view
  beforeEach(module('pApp'));
  beforeEach(module('components/online-users/online-users.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<online-users></online-users>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the onlineUsers directive');
  }));
});