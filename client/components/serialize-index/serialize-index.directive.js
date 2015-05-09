'use strict';

angular.module('pApp')
  .directive('serializeIndex', function (dataModel, $filter, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        fetchFnName: '@',
        resource: '='
      },
      link: function (scope, element, attrs) {
        scope.data = dataModel.syncData();
        scope.items = $filter('orderBy')(dataModel[scope.fetchFnName](), 'index');
        var modelChange;
        var serializing;
        scope.$watch('data.' + scope.fetchFnName + '()', function(n, o){
          if(n && n!==o && !serializing) {
            modelChange = true;
            scope.items = $filter('orderBy')(dataModel[scope.fetchFnName](), 'index');
            $timeout(function() {
              modelChange = false;
            }, 200);
          }
        }, true);
        scope.update = function() {
          if(!modelChange) {
            if(scope.items && scope.items.length) {
              for(var f=0; f<scope.items.length; f++) {
                if(scope.items[f].index!==f) {
                  scope.items[f].index = f; 
                  scope.resource.save({id:scope.items[f]._id}, {index:f});
                }
              }
            }
          }
        };
      }
    };
  });