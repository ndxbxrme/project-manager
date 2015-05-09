'use strict';

describe('Controller: ModalCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var ModalCategoryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalCategoryCtrl = $controller('ModalCategoryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
