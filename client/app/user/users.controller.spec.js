'use strict';

describe('Controller: UsersCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var UserCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserCtrl = $controller('UsersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
