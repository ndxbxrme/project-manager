'use strict';

angular.module('pApp')
.factory('status', function ($resource) {
  return $resource('/api/statuses/:id/:controller', {
    id: '@_id'
  });
});