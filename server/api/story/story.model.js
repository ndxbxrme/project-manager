'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StorySchema = new Schema({
  name: String,
  info: String,
  reproduce: String,
  active: Boolean,
  project: Schema.Types.ObjectId,
  list: Schema.Types.ObjectId,
  category: Schema.Types.ObjectId,
  status: Schema.Types.ObjectId,
  priority: Schema.Types.ObjectId,
  notes: [{}],
  tags: [String],
  history: [{}],
  attachments: [{}],
  handler: Schema.Types.ObjectId,
  reporter: Schema.Types.ObjectId,
  workers: [Schema.Types.ObjectId],
  dateCreated: {type:Date, default:Date.now},
  dateUpdated: {type:Date, default:Date.now},
  startDate: {type:Date, default:Date.now},
  dueDate: Date,
  company: Schema.Types.ObjectId
});

module.exports = mongoose.model('Story', StorySchema);