'use strict';

var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
  id: Number,
  location: String
});

var Locations = mongoose.model('Locations', locationSchema);

module.exports = Locations;