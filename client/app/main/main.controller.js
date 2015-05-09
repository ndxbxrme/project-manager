'use strict';

angular.module('pApp')
  .controller('MainCtrl', function ($scope, $http, dataModel, project, status, modal) {
    $scope.modal = modal;
    $scope.data = dataModel.syncData();
    $scope.projectRes = project;
    $scope.statusRes = status;
  });
