'use strict';

angular.module('pApp')
  .factory('panel', function () {
    var type,
        id;
    return {
      getType: function() { return type;},
      setType: function(v) { type = v;},
      getId: function() { return id;},
      setId: function(v) { id = v;}
    };
  });
