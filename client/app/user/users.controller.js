'use strict';

angular.module('pApp')
.controller('UsersCtrl', function ($scope, dataModel) {
  $scope.data = dataModel.syncData();
});
