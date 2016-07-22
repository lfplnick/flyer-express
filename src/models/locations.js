'use strict';

var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
  location: String
});

var Locations = mongoose.model('Locations', locationSchema);

module.exports = Locations;