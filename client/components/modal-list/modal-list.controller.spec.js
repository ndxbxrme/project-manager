'use strict';

describe('Controller: ModalListCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var ModalListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalListCtrl = $controller('ModalListCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
