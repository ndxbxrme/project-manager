'use strict';

angular.module('pApp')
.factory('list', function ($resource) {
  return $resource('/api/lists/:id/:controller', {
    id: '@_id'
  });
});