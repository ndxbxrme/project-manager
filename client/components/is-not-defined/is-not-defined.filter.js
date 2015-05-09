'use strict';

angular.module('pApp')
  .filter('isNotDefined', function () {
    return function (input, prop) {
      var filteredItems = [];
      angular.forEach(input, function(item) {
        if(!angular.isDefined(item[prop])) {
          filteredItems.push(item);   
        }
      });
      return filteredItems;
    };
  });
