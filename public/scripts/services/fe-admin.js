'use strict';

angular.module('feAdmin')

.service('dataService', function($http, $q){
  this.getFormats = function(cb){
    $http.get('/mock/formats.json').then(cb);
  };

  this.getLocationList = function(cb){
    // $http.get('/mock/locationList.json').then(cb);
    $http.get('/api/locations').then(cb);
  };

  this.saveLocations = function(locations, cb){
    var qRequest = [];
    var qNew = [];
    var iMod = 0;
    var iDel = 0;
    locations.forEach(function(location){
      var request;

      // Add new locations
      if(location.isNew){
        qNew.push({"location": location.location});
      } 

      // Update existing locations
      else if (location.isMod){
        var locationUpdate = {"_id": location._id, "location": location.location};
        request = $http.put('/api/locations/' + location._id + "/update", locationUpdate);
        qRequest.push(request);
        iMod++;
      }

      // Delete old locations
      else if (location.isDel){
        request = $http.put('/api/locations/' + location._id + "/delete");
        qRequest.push(request);
        iDel++;
      }

    });

    var newRequest = $http.post('/api/locations', qNew);
    qRequest.push(newRequest);

    $q.all(qRequest).then(function(results){
      console.log(qNew.length + " locations added, " + iMod + " modified, " + iDel + " deleted");
    }).then(cb);
  };

  this.sortLocationList = function(list){
    list.sort(function(a,b){
      return a.location.localeCompare(b.location);
    });
  };
})

;