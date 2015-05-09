'use strict';

angular.module('pApp')
.factory('dataModel', function (team, project, story, category, list, priority, status, User, socket) {
  var teams,
      projects,
      stories,
      statuses,
      categories,
      lists,
      priorities,
      users;
  var hasSync;
  return {
    syncData: function(authToken, cb) {
      if(!hasSync && authToken) {
        hasSync = true;
        socket.create(authToken);
        var n = 8;
        teams = team.query(function() {
          socket.syncUpdates('team', teams);
          if(cb && --n===0) { cb();}
        });
        projects = project.query(function() {
          socket.syncUpdates('project', projects);
          if(cb && --n===0) { cb();}
        });
        stories = story.query(function() {
          socket.syncUpdates('story', stories);
          if(cb && --n===0) { cb();}
        });
        statuses = status.query(function() {
          socket.syncUpdates('status', statuses);
          if(cb && --n===0) { cb();}
        });
        categories = category.query(function() {
          socket.syncUpdates('category', categories);
          if(cb && --n===0) { cb();}
        });
        lists = list.query(function() {
          socket.syncUpdates('list', lists);
          if(cb && --n===0) { cb();}
        });
        priorities = priority.query(function() {
          socket.syncUpdates('priority', priorities);
          if(cb && --n===0) { cb();}
        });
        users = User.query(function() {
          socket.syncUpdates('user', users);
          if(cb && --n===0) { cb();}
        });
      }
      else if(cb) {
        cb(); 
      }
      return this;
    },
    unsyncData: function() { 
      if(hasSync) {
        socket.unsyncUpdates('category');
        socket.unsyncUpdates('list');
        socket.unsyncUpdates('priority');
        socket.unsyncUpdates('project');
        socket.unsyncUpdates('status');
        socket.unsyncUpdates('story');
        socket.unsyncUpdates('team');
        socket.unsyncUpdates('user');
      }
    },
    getTeams: function() { return teams; },
    getProjects: function() { return projects; },
    getStories: function() { return stories; },
    getStatuses: function() { return statuses; },
    getCategories: function() { return categories; },
    getLists: function() { return lists; },
    getPriorities: function() { return priorities; },
    getUsers: function() { return users; },
    projects: projects
  };
});
