'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  color: String,
  index: Number,
  company: Schema.Types.ObjectId
});

module.exports = mongoose.model('Team', TeamSchema);