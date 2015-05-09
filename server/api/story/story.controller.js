'use strict';

var _ = require('lodash');
var Story = require('./story.model');

// Get list of storys
exports.index = function(req, res) {
  Story.find(function (err, storys) {
    if(err) { return handleError(res, err); }
    return res.json(200, storys);
  });
};

// Get a single story
exports.show = function(req, res) {
  Story.findById(req.params.id, function (err, story) {
    if(err) { return handleError(res, err); }
    if(!story) { return res.send(404); }
    return res.json(story);
  });
};

// Creates a new story in the DB.
exports.create = function(req, res) {
  Story.create(req.body, function(err, story) {
    if(err) { return handleError(res, err); }
    return res.json(201, story);
  });
};

// Updates an existing story in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Story.findById(req.params.id, function (err, story) {
    if (err) { return handleError(res, err); }
    if(!story) { return res.send(404); }
    var updated = _.merge(story, req.body);
    if(req.body.workers) {
      updated.workers = [];
      updated.workers = req.body.workers;
    }
    if(req.body.attachments) {
      updated.attachments = [];
      updated.attachments = req.body.attachments;
    }
    if(req.body.history) {
      updated.history = [];
      updated.history = req.body.history;
    }
    if(req.body.notes) {
      updated.notes = [];
      updated.notes = req.body.notes;
    }
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, story);
    });
  });
};

// Deletes a story from the DB.
exports.destroy = function(req, res) {
  Story.findById(req.params.id, function (err, story) {
    if(err) { return handleError(res, err); }
    if(!story) { return res.send(404); }
    story.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}