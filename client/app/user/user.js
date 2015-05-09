'use strict';

angular.module('pApp')
.config(function ($stateProvider) {
  $stateProvider
  .state('user', {
    url: '/user',
    templateUrl: 'app/user/users.html',
    controller: 'UsersCtrl'
  })
  .state('useredit', {
    url: '/user/:id',
    templateUrl: 'app/user/user.html',
    controller: 'UserCtrl'
  });
});