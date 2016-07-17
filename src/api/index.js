'use strict';

var busboy = require('connect-busboy');
const crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var path = require('path');

var todos = require('../../mock/todos.json');


var router = express.Router();
router.use(busboy());

router.get('/todos', function(req, res){
  res.json({"todos": todos});
});

router.get('/admin', function(req, res){
  res.send('Are you lost?');
});

router.post('/fup', function(req,res){
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    console.log("Uploading: " + filename);
    var uploadsPath = __dirname + '/../../public/uploads/';
    var filePath = uploadsPath + filename;
    fstream = fs.createWriteStream(filePath);
    file.pipe(fstream);

    fstream.on('close', function(){
      var rStream = fs.createReadStream(filePath);
      var rHash = crypto.createHash('sha256', rStream);
      rStream.on('data', function(data){
        rHash.update(data);
      });

      rStream.on('end', function(){
        var rDigest = rHash.digest('hex');
        var newFilename = rDigest + path.extname(filename);
        var newPath = uploadsPath + newFilename;
        fs.rename(filePath, newPath, function(){
          console.log("'" + filename + "' moved to: " + newFilename);
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          "filename": newFilename
        }));
      });
    });
  });
});

module.exports = router;
