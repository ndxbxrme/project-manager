'use strict';

angular.module('pApp')
  .directive('notes', function (Auth) {
    return {
      templateUrl: 'components/notes/notes.html',
      restrict: 'EA',
      require: 'ngModel',
      replace: true,
      scope: {},
      link: function (scope, element, attrs, ngModel) {
        ngModel.$formatters.unshift(function(v) {
          scope.notes = v;
          scope.note = undefined;
        });
        scope.notesubmit = function() {
          if(scope.noteform.$valid) {
            scope.notes.push({
              userId: Auth.getCurrentUser()._id,
              date: new Date(),
              note: scope.note
            });
            ngModel.$setViewValue(scope.notes);
            ngModel.$setDirty();
            scope.note = undefined;
            scope.noteOpen = undefined;
          }
        };
      }
    };
  });