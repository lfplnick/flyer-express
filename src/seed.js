'use strict';

var Location = require('./models/locations.js');

var locations = [
  {"location": "Main"},
  {"location": "Bon Air"},
  {"location": "Westport"},
  {"location": "Crescent Hill"},
  {"location": "Fairdale"},
  {"location": "Middletown"},
  {"location": "St. Matthews"},
  {"location": "Fern Creek"},
  {"location": "Highlands"},
  {"location": "Iroquois"},
  {"location": "Jeffersontown"},
  {"location": "Okolona"},
  {"location": "Portland"},
  {"location": "Shawnee"},
  {"location": "Southwest"},
  {"location": "Western"},
  {"location": "Newburg"},
  {"location": "Shively"}
];

locations.forEach(function(location, index){
  Location.find({"location": location.location}, function(err, locations){
    if(!err && locations.length===0) {
      Location.create({"id": location.id, "location": location.location});
    }
  });
})