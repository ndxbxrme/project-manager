'use strict';

angular.module('pApp')
  .factory('history', function ($interpolate, Auth) {
    var messages = {
      'story:create': 'Created by <a href="user/{{data.userId}}">{{data.userName}}</a>',
      'story:name': 'Name updated by <a href="user/{{data.userId}}">{{data.userName}}</a>',
      'story:info': 'Info updated by <a href="user/{{data.userId}}">{{data.userName}}</a>',
      'story:noteform': 'Note added by <a href="user/{{data.userId}}">{{data.userName}}</a>'
    };
    var makeHistory = function(data) {
      var user = Auth.getCurrentUser();
      data.userId = user._id;
      data.userName = user.name;
      var msg = messages[data.type + ':' + data.ctrl];
      var template = $interpolate(msg);
      msg = template({data: data});
      return {
        user: data.userId,
        val: data.val,
        date: new Date(),
        msg: msg
      };
    };
    return {
      makeHistory: function(item, type, form) {
        if(!item.history) {
          item.history = []; 
        }
        if(!item._id) {
          item.history.push(makeHistory({type:type, ctrl:'create'})); 
        }
        else {
          angular.forEach(form, function(elem) {
            if(elem && elem.$dirty) {
              item.history.push(makeHistory({type:type, ctrl:elem.$name, val:elem.$modelValue}));
            }
          });
        }
      }
    };
  });
