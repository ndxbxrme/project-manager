'use strict';

describe('Controller: ModalPriorityCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var ModalPriorityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalPriorityCtrl = $controller('ModalPriorityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
