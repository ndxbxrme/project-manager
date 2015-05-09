/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Status = require('./status.model');

exports.register = function(socket) {
  Status.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Status.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('status:' + socket.cid + ':save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('status:' + socket.cid + ':remove', doc);
}