'use strict';

angular.module('pApp')
  .directive('minicolors', function () {
    return {
      restrict: 'EA',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        console.log('yoyoyo');
        ngModel.$formatters.unshift(function(value){
          if(value) {
            element.minicolors({
              defaultValue: value
            });
          }
          return value;
        });
      }
    };
  });