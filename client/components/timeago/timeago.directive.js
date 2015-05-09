'use strict';

angular.module('pApp')
  .directive('timeago', function () {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        $(element).timeago();
      }
    };
  });