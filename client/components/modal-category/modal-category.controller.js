'use strict';

angular.module('pApp')
  .controller('ModalCategoryCtrl', function ($scope, modal, category, dataModel) {
    $scope.data = dataModel;
    $scope.forms = {};
    $scope.category = modal.getId() ? category.get({id:modal.getId()}) : {};
    $scope.submit = function() {
      $scope.submitted = true;
      if($scope.forms.form.$valid) {
        category.save({id:modal.getId()}, $scope.category);
        $scope.close();
      }
    };
    $scope.remove = function() {
      category.remove({id:modal.getId()});
      $scope.close();
    };
  });
