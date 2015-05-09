'use strict';

angular.module('pApp')
.factory('team', function ($resource) {
  return $resource('/api/teams/:id/:controller', {
    id: '@_id'
  });
});