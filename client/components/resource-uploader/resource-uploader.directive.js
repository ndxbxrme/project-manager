'use strict';

angular.module('pApp')
  .directive('resourceUploader', function () {
    return {
      templateUrl: 'components/resource-uploader/resource-uploader.html',
      restrict: 'EA',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$formatters.unshift(function(v) {
          scope.attachments = v || [];
          return v;
        });
        scope.$watch('upimage', function(n) {
          if(n) {
            scope.attachments.push(n);
            scope.upimage = undefined;
            ngModel.$setViewValue(scope.attachments);
            ngModel.$setDirty();
          }
        });
      }
    };
  });