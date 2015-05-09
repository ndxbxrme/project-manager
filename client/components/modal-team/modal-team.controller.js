'use strict';

angular.module('pApp')
  .controller('ModalTeamCtrl', function ($scope, modal, team, dataModel) {
    $scope.data = dataModel;
    $scope.forms = {};
    $scope.team = modal.getId() ? team.get({id:modal.getId()}) : {
      color: Please.make_color()
    };
    $scope.submit = function() {
      $scope.submitted = true;
      if($scope.forms.form.$valid) {
        team.save({id:modal.getId()}, $scope.team);
        $scope.close();
      }
    };
    $scope.remove = function() {
      team.remove({id:modal.getId()});
      $scope.close();
    };
  });
