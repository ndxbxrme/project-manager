'use strict';

angular.module('pApp')
.factory('category', function ($resource) {
  return $resource('/api/categories/:id/:controller', {
    id: '@_id'
  });
});
