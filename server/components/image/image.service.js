'use strict';

var cloudinary = require('cloudinary');
var config = require('../../config/environment');
var emojis = require('./emoji.service.js');

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret
});

var randomEmoji = function(done) {
  cloudinary.uploader.upload('https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/' + emojis[Math.floor(Math.random() * emojis.length)], function(result) {
    if(result && done) {
      done(null, result); 
    }
  });
};

exports.randomEmoji = randomEmoji;