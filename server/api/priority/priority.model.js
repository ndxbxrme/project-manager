'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PrioritySchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  index: Number,
  company: Schema.Types.ObjectId
});

module.exports = mongoose.model('Priority', PrioritySchema);