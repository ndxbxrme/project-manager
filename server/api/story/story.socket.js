/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Story = require('./story.model');

exports.register = function(socket) {
  Story.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Story.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('story:' + socket.cid + ':save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('story:' + socket.cid + ':remove', doc);
}