'use strict';

angular.module('pApp')
.factory('story', function ($resource) {
  return $resource('/api/stories/:id/:controller', {
    id: '@_id'
  });
});