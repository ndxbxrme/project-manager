'use strict';

describe('Directive: imageUploader', function () {

  // load the directive's module and view
  beforeEach(module('pApp'));
  beforeEach(module('components/image-uploader/image-uploader.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<image-uploader></image-uploader>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the imageUploader directive');
  }));
});