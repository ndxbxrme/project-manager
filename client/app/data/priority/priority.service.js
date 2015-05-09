'use strict';

angular.module('pApp')
.factory('priority', function ($resource) {
  return $resource('/api/priorities/:id/:controller', {
    id: '@_id'
  });
});