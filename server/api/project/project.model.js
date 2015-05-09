'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  image: {},
  color: String,
  startDate: Date,
  dueDate: Date,
  index: Number,
  users: [Schema.Types.ObjectId],
  statuses: [Schema.Types.ObjectId],
  history: [{}],
  tags: [{}],
  company: Schema.Types.ObjectId
});

module.exports = mongoose.model('Project', ProjectSchema);