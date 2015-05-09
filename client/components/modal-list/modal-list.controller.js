'use strict';

angular.module('pApp')
  .controller('ModalListCtrl', function ($scope, modal, list, dataModel) {
    $scope.data = dataModel;
    $scope.forms = {};
    $scope.list = modal.getId() ? list.get({id:modal.getId()}) : {};
    $scope.submit = function() {
      $scope.submitted = true;
      if($scope.forms.form.$valid) {
        list.save({id:modal.getId()}, $scope.list);
        $scope.close();
      }
    };
    $scope.remove = function() {
      list.remove({id:modal.getId()});
      $scope.close();
    };
  });
