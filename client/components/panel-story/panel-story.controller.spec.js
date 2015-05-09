'use strict';

describe('Controller: PanelStoryCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var PanelStoryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PanelStoryCtrl = $controller('PanelStoryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
