'use strict';

describe('Controller: PanelCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var PanelCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PanelCtrl = $controller('PanelCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
