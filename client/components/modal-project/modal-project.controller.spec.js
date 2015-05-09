'use strict';

describe('Controller: ModalProjectCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var ModalProjectCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalProjectCtrl = $controller('ModalProjectCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
