'use strict';

describe('Controller: ModalTeamCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var ModalTeamCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalTeamCtrl = $controller('ModalTeamCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
