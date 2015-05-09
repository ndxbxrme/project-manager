'use strict';

angular.module('pApp')
  .controller('AdminCtrl', function ($scope, $http, $timeout, $filter, Auth, User, status, category, priority, team, list, dataModel, modal) {

    $scope.modal = modal;
    $scope.data = dataModel.syncData();
    $scope.statusRes = status;
    $scope.categoryRes = category;
    $scope.priorityRes = priority;
    $scope.teamRes = team;
    $scope.listRes = list;
  });
