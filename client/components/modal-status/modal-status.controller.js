'use strict';

angular.module('pApp')
  .controller('ModalStatusCtrl', function ($scope, modal, status, dataModel) {
    $scope.data = dataModel;
    $scope.forms = {};
    $scope.status = modal.getId() ? status.get({id:modal.getId()}) : {};
    $scope.submit = function() {
      $scope.submitted = true;
      if($scope.forms.form.$valid) {
        status.save({id:modal.getId()}, $scope.status);
        $scope.close();
      }
    };
    $scope.remove = function() {
      status.remove({id:modal.getId()});
      $scope.close();
    };
  });
