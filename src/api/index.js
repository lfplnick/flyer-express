'use strict';

var express = require('express');
var todos = require('../../mock/todos.json');

var router = express.Router();

router.get('/todos', function(req, res){
  res.json({"todos": todos});
});

router.get('/admin', function(req, res){
  res.send('Are you lost?');
});

module.exports = router;
