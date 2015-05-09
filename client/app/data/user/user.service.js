'use strict';

angular.module('pApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      status: {
        method: 'POST',
        params: {
          controller:'status' 
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
