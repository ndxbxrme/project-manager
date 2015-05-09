'use strict';

describe('Controller: ModalStatusCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var ModalStatusCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalStatusCtrl = $controller('ModalStatusCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
