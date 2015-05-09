'use strict';

angular.module('pApp')
  .directive('kanban', function (dataModel, $timeout, $window) {
    return {
      templateUrl: 'components/kanban/kanban.html',
      restrict: 'EA',
      scope: {
        project: '='
      },
      link: function (scope, element, attrs) {
        scope.data = dataModel.syncData();
        scope.columnWidth = 20;
        var resize = function() {
          $timeout(function(){
            if(head.screen.innerWidth < 600) { scope.columnWidth = 100; }
            else if(head.screen.innerWidth < 900) { scope.columnWidth = 50; }
            else if(head.screen.innerWidth < 1400) { scope.columnWidth = 33.3; }
            else { scope.columnWidth = 20; }
          });
        };
        resize();
        $window.addEventListener('resize', resize, false);
        scope.$on('$destroy', function() {
          $window.removeEventListener('resize', resize, false);
        });  
        scope.options = {
          forceHelperSize: true,
          forcePlaceHolderSize: true
        };
      }
    };
  });