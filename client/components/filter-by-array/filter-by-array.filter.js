'use strict';

angular.module('pApp')
  .filter('filterByArray', function () {
    return function (input, array, prop) {
      var filteredItems = [];
      if(array && array.length) {
        angular.forEach(input, function(item) {
          if(angular.isDefined(item[prop]) && array.indexOf(item[prop])!==-1) {
            filteredItems.push(item); 
          }
        });
      }
      return filteredItems;
    };
  });
