'use strict';

angular.module('pApp')
  .directive('resourceImage', function () {
    return {
      templateUrl: 'components/resource-image/resource-image.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });