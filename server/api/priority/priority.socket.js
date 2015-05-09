/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Priority = require('./priority.model');

exports.register = function(socket) {
  Priority.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Priority.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('priority:' + socket.cid + ':save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('priority:' + socket.cid + ':remove', doc);
}