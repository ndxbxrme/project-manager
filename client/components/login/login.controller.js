'use strict';

angular.module('pApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
  
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
