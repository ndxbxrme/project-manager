'use strict';

angular.module('pApp')
.factory('project', function ($resource) {
  return $resource('/api/projects/:id/:controller', {
    id: '@_id'
  });
});