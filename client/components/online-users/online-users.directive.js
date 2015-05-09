'use strict';

angular.module('pApp')
  .directive('onlineUsers', function (dataModel, $filter) {
    return {
      templateUrl: 'components/online-users/online-users.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.data = dataModel;
        scope.$watch('data.getUsers()', function(n) {
          if(n) {
            scope.count = $filter('filter')(dataModel.getUsers(), {online:true}).length;
          }
        }, true);
      }
    };
  });