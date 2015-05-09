'use strict';

angular.module('pApp')
  .controller('PanelCtrl', function ($scope, panel) {
    $scope.panel = panel;
    $scope.close = function() {
      FoundationApi.publish('panel', 'close');
      $timeout(function() {
        panel.setType(undefined);
      }, 300);
    };
  });
