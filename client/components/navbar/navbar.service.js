'use strict';

angular.module('pApp')
  .factory('navbar', function () {
    var project = {};
    return {
      getProjectTitle: function() {
        return project.name; 
      },
      getProjectId: function() {
        return project._id;
      },
      setProject: function(v) {
        project = v;
      },
      clearProject: function() {
        project = {}; 
      }
    }
  });
