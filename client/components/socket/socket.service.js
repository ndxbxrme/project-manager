/* global io */
'use strict';

angular.module('pApp')
  .factory('socket', function(socketFactory) {

    var ioSocket;
    var socket;
    var companyId;
    // socket.io now auto-configures its connection when we ommit a connection url
    var create = function(authToken) {
      companyId = '123';
      ioSocket = io('', {
        // Send auth token on connection, you will need to DI the Auth service above
        'query': 'token=' + authToken + '&cid=' + companyId,
        path: '/socket.io-client'
      });

      socket = socketFactory({
        ioSocket: ioSocket
      });
    };

    return {
      socket: socket,
      create: create,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':' + companyId + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':' + companyId + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':' + companyId + ':save');
        socket.removeAllListeners(modelName + ':' + companyId + ':remove');
      }
    };
  });
