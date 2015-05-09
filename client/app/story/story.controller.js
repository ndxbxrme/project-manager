'use strict';

angular.module('pApp')
.controller('StoryCtrl', function ($scope, dataModel, story, project, history, $window, $timeout, $stateParams) {
  $scope.data = dataModel.syncData(null, function(){
    if($stateParams.id) {
      story.get({id:$stateParams.id}, function(story){
        project.get({id:story.project}, function(project){
          $scope.project = project; 
          $timeout(function(){
            $scope.story = story;
          }, 0);
        });
      });
    }
    else {
      $scope.story = {};
      $scope.project = project.get({id:$stateParams.project}); 
      $scope.story.project = $stateParams.project;
    }
  });
  $scope.submit = function() {
    $scope.submitted = true;
    if($scope.form.$valid) {
      history.makeHistory($scope.story, 'story', $scope.form);
      story.save({id:$scope.story._id}, $scope.story);
      $window.history.back();
    }
  };
  $scope.remove = function() {
    story.remove({id:$scope.story._id});
    $window.history.back();
  };
});
