'use strict';

angular.module('feAdmin')

.service('dataService', function($http){
  this.getFormats = function(cb){
    $http.get('/mock/formats.json').then(cb);
  };

  this.getLocationList = function(cb){
    // $http.get('/mock/locationList.json').then(cb);
    $http.get('/api/locations').then(cb);
  };

  this.sortLocationList = function(list){
    list.sort(function(a,b){
      return a.location.localeCompare(b.location);
    });
  };
})

;