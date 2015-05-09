'use strict';

angular.module('pApp')
.config(function ($stateProvider) {
  $stateProvider
  .state('/editstory', {
    url: '/story/:id',
    templateUrl: 'app/story/story.html',
    controller: 'StoryCtrl'      
  })
  .state('/newstory', {
    url: '/story/:project/new',
    templateUrl: 'app/story/story.html',
    controller: 'StoryCtrl'      
  });
});