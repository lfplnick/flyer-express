'use strict';

var busboy = require('connect-busboy');
const crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var path = require('path');

var todos = require('../../mock/todos.json');
var Locations = require('../models/locations.js');


var router = express.Router();
router.use(busboy());

router.get('/todos', function(req, res){
  res.json({"todos": todos});
});






router.get('/locations', function(req, res){
  // Locations.find({}, {id: true, location: true, _id: false}, {sort:{location:1}, limit:3}, function(err, locations){
  Locations.find({}, {location: true}, function(err, locations){
    if(err){
      return res.status(500).json({message: err.message});
    }

    res.json(locations);
  });
});

router.post('/locations', function(req, res){
  var location = req.body;
  Locations.create(location, function(err, location){
    if(err){
      return res.status(500).json({err: err.message});
    }

    res.send(location);
  });
});

router.put('/locations/:id/:action', function(req, res){
  var id = req.params.id;
  var action = req.params.action.toLowerCase();
  var location = req.body;

  if (action === "update"){
    if (location && location._id !== id){
      return res.status(500).json({err: "IDs don't match!"});
    }

    Locations.findByIdAndUpdate(id, location, {new: true}, function(err, location){
      if(err){
        return res.status(500).json({err: err.message});
      }

      res.json({"message": "Location updated successfully", "location": location});
    });
  }
  else if (action === "delete"){
    Locations.findByIdAndRemove(id, function(err, location){
      if(err){
        return res.status(500).json({err: err.message});
      }

      res.json({"message": "Location deleted successfully", "location": location});
    });
  }
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
