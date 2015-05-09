'use strict';

describe('Directive: resourceUploader', function () {

  // load the directive's module and view
  beforeEach(module('pApp'));
  beforeEach(module('components/resource-uploader/resource-uploader.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<resource-uploader></resource-uploader>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the resourceUploader directive');
  }));
});