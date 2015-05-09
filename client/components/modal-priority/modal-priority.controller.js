'use strict';

angular.module('pApp')
  .controller('ModalPriorityCtrl', function ($scope, modal, priority, dataModel) {
    $scope.data = dataModel;
    $scope.forms = {};
    $scope.priority = modal.getId() ? priority.get({id:modal.getId()}) : {};
    $scope.submit = function() {
      $scope.submitted = true;
      if($scope.forms.form.$valid) {
        priority.save({id:modal.getId()}, $scope.priority);
        $scope.close();
      }
    };
    $scope.remove = function() {
      priority.remove({id:modal.getId()});
      $scope.close();
    };
  });
