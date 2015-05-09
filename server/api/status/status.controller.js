'use strict';

var _ = require('lodash');
var Status = require('./status.model');

// Get list of statuss
exports.index = function(req, res) {
  Status.find(function (err, statuss) {
    if(err) { return handleError(res, err); }
    return res.json(200, statuss);
  });
};

// Get a single status
exports.show = function(req, res) {
  Status.findById(req.params.id, function (err, status) {
    if(err) { return handleError(res, err); }
    if(!status) { return res.send(404); }
    return res.json(status);
  });
};

// Creates a new status in the DB.
exports.create = function(req, res) {
  Status.create(req.body, function(err, status) {
    if(err) { return handleError(res, err); }
    return res.json(201, status);
  });
};

// Updates an existing status in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Status.findById(req.params.id, function (err, status) {
    if (err) { return handleError(res, err); }
    if(!status) { return res.send(404); }
    var updated = _.merge(status, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, status);
    });
  });
};

// Deletes a status from the DB.
exports.destroy = function(req, res) {
  Status.findById(req.params.id, function (err, status) {
    if(err) { return handleError(res, err); }
    if(!status) { return res.send(404); }
    status.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}