'use strict';

angular.module('pApp')
.controller('UserCtrl', function ($scope, dataModel, User, $stateParams, $window) {
  $scope.data = dataModel.syncData();
  if($stateParams.id) {
    $scope.user = User.get({id:$stateParams.id});
  }
  
  $scope.submit = function() {
    $scope.submitted = true;
    if($scope.form.$valid) {
      User.save({id:$scope.user._id}, $scope.user);
      $window.history.back();
    }
  };
});
