'use strict';

angular.module('pApp')
  .controller('ModalCtrl', function ($scope, $timeout, modal, FoundationApi) {
    $scope.modal = modal;
    $scope.close = function() {
      FoundationApi.publish('modal', 'close');
      $timeout(function(){
        modal.setType(undefined);
      }, 300);
    };
  });
