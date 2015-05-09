'use strict';

angular.module('pApp')
  .directive('resourceImage', function () {
    return {
      templateUrl: 'components/resource-image/resource-image.html',
      restrict: 'EA',
      scope: {
        image: '=resourceImage',
        text: '@',
        size: '@'
      },
      replace: true,
      link: function (scope, element, attrs) {
        scope.width = scope.height = 150;
        if(scope.size) {
          scope.width = scope.size.split('x')[0];
          scope.height = scope.size.split('x')[1]; 
        }
      }
    };
  });