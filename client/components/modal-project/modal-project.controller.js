'use strict';

angular.module('pApp')
  .controller('ModalProjectCtrl', function ($scope, modal, project, dataModel) {
    $scope.data = dataModel;
    $scope.forms = {};
    $scope.project = modal.getId() ? project.get({id:modal.getId()}) : {
      color: Please.make_color()
    };
    $scope.submit = function() {
      $scope.submitted = true;
      if($scope.forms.form.$valid) {
        project.save({id:modal.getId()}, $scope.project);
        $scope.close();
      }
    };
    $scope.remove = function() {
      project.remove({id:modal.getId()});
      $scope.close();
    };
  });
