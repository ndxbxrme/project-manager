'use strict';

describe('Controller: StoryCtrl', function () {

  // load the controller's module
  beforeEach(module('pApp'));

  var StoryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StoryCtrl = $controller('StoryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
