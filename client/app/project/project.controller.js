'use strict';

angular.module('pApp')
  .controller('ProjectCtrl', function ($scope, $stateParams, project, navbar, dataModel, panel, $window, $timeout) {
    $scope.data = dataModel.syncData();
    $scope.panel = panel;
    $scope.project = project.get({id:$stateParams.id}, function(){
      navbar.setProject($scope.project); 
    });

  });
