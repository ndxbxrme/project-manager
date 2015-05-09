'use strict';

var _ = require('lodash'),
    join = require('path').join,
    exec = require('child_process').exec,
    cloudinary = require('cloudinary'),
    fs = require('fs'),
    script = __dirname + '/rasterize.js',
    bin = 'phantomjs';

// Creates a new screenshot in the DB.
exports.create = function(req, res) {
  var url = req.body.url;
  var path = join(__dirname + '/../tmp', Date.now() + '' + Math.floor(Math.random()*23587325) + '.png');
  var options = {
    path: path,
    viewportWidth: '1024',
    viewportHeight: '600'
  }
  var cmd = [bin, script, url, path, '1024x600'];
  cmd = cmd.join(' ');
  exec(cmd, function(err){
    console.log(cmd);
    if(err) {
      console.log('it errored');
      return handleError(res, err); 
    }
    cloudinary.uploader.upload(path, function(result) {
      fs.unlinkSync(path);
      result.resource_type = 'webpage';
      return res.json(201, result);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}