'use strict';

angular.module('pApp')
  .factory('modal', function () {
    var type,
        data,
        id;
    return {
      getType: function() {return type},
      getData: function() {return data},
      getId: function() {return id},
      setType: function(v) {type = v;},
      setData: function(v) {data = v;},
      setId: function(v) {id = v;}
    };
  });
