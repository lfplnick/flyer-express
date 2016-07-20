'use strict';

var Location = require('./models/locations.js');

var locations = [
  {"id": 0, "location": "Main"},
  {"id": 1, "location": "Bon Air"},
  {"id": 2, "location": "Westport"},
  {"id": 3, "location": "Crescent Hill"},
  {"id": 4, "location": "Fairdale"},
  {"id": 5, "location": "Middletown"},
  {"id": 6, "location": "St. Matthews"},
  {"id": 7, "location": "Fern Creek"},
  {"id": 8, "location": "Highlands"},
  {"id": 9, "location": "Iroquois"},
  {"id": 10, "location": "Jeffersontown"},
  {"id": 11, "location": "Okolona"},
  {"id": 12, "location": "Portland"},
  {"id": 13, "location": "Shawnee"},
  {"id": 14, "location": "Southwest"},
  {"id": 15, "location": "Western"},
  {"id": 16, "location": "Newburg"},
  {"id": 17, "location": "Shively"}
];

locations.forEach(function(location, index){
  Location.find({"location": location.location}, function(err, locations){
    if(!err && locations.length===0) {
      Location.create({"id": location.id, "location": location.location});
    }
  });
})