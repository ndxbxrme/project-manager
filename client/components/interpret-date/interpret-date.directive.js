'use strict';

angular.module('pApp')
  .directive('interpretDate', function($filter) {
    return {
      restrict: 'AE',
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
        ngModel.$parsers.unshift(function(value) {
          return iD.interpretText(value);
        });
        ngModel.$formatters.unshift(function(value){
          return $filter('date')(value, 'short');
        });
      }
    };
  });