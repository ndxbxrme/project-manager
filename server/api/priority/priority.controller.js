'use strict';

var _ = require('lodash');
var Priority = require('./priority.model');

// Get list of prioritys
exports.index = function(req, res) {
  Priority.find(function (err, prioritys) {
    if(err) { return handleError(res, err); }
    return res.json(200, prioritys);
  });
};

// Get a single priority
exports.show = function(req, res) {
  Priority.findById(req.params.id, function (err, priority) {
    if(err) { return handleError(res, err); }
    if(!priority) { return res.send(404); }
    return res.json(priority);
  });
};

// Creates a new priority in the DB.
exports.create = function(req, res) {
  Priority.create(req.body, function(err, priority) {
    if(err) { return handleError(res, err); }
    return res.json(201, priority);
  });
};

// Updates an existing priority in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Priority.findById(req.params.id, function (err, priority) {
    if (err) { return handleError(res, err); }
    if(!priority) { return res.send(404); }
    var updated = _.merge(priority, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, priority);
    });
  });
};

// Deletes a priority from the DB.
exports.destroy = function(req, res) {
  Priority.findById(req.params.id, function (err, priority) {
    if(err) { return handleError(res, err); }
    if(!priority) { return res.send(404); }
    priority.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}