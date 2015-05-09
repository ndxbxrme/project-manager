/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var List = require('./list.model');

exports.register = function(socket) {
  List.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  List.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('list:' + socket.cid + ':save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('list:' + socket.cid + ':remove', doc);
}