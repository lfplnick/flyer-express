'use strict';

var express = require('express');
var router = express.Router();

router.get('/admin', function(req, res){
  res.send("Hello admin, did you know you're in the api section?");
});

module.exports = router;
