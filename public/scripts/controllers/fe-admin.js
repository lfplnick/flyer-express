'use strict';

angular.module('feAdmin')

.controller('mainCtrl', function($scope){
})

/*******************************************************************************
 *  Add Literature Controller
 ******************************************************************************/
.controller('feAdminAddLitCtrl', function($scope, $http, dataService){
  $scope.defaults = {
    "type": "flyer",
    "title": "",
    "desc": "",
    "format": "",
    "isOngoing": false,
    "dateEvent": new Date(),
    "isFeatured": false,
    "dateExpires": new Date(),
    "locations": [],
    "thumb": "empty.jpg",
    "thumbFile": ""
  };

  $scope.selectedLocation = "";

  dataService.getFormats(function(res){
    $scope.formats = res.data;
    $scope.defaults.format = $scope.formats[2];
    $scope.initForm();
  });

  dataService.getLocationList(function(res){
    $scope.locationList = res.data;
    dataService.sortLocationList($scope.locationList);
  });


  $scope.uploadFile = function(){
    var file = $scope.lit.thumbFile;
    var uploadUrl = '/api/fup';
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .success(function(res){
      console.log("File uploaded: " + res.filename);
      $scope.lit.thumb = res.filename;
    })
    .error(function(){
    });
  };

  $scope.initForm = function(){
    $scope.lit = {
      "type": $scope.defaults.type,
      "title": $scope.defaults.title,
      "desc": $scope.defaults.desc,
      "format": $scope.defaults.format,
      "isOngoing": $scope.defaults.isOngoing,
      "dateEvent": $scope.defaults.dateEvent,
      "isFeatured": $scope.defaults.isFeatured,
      "dateExpires": $scope.defaults.dateExpires,
      "locations": [],
      "thumb": $scope.defaults.thumb,
      "thumbFile": $scope.defaults.thumbFile
    };
  };

  $scope.resetForm = function(){
    $("#newLit").modal('hide');

    $scope.resetLocations();
    $scope.initForm();
  };

  $scope.addLocation = function(){
    // $scope.lit.locations.push($scope.locationList[key]);
    // var length = $scope.lit.locations.length;

    $scope.lit.locations.push($scope.selectedLocation);
    $scope.sortSelectedLocations();
    $scope.updateLocationList();
    $scope.selectedLocation = "";
    // $scope.lit.locations.unshift($scope.locationList.splice(key, 1));    
  };

  $scope.addAllLocations = function(){
    $scope.lit.locations.push.apply($scope.lit.locations, $scope.locationList);
    $scope.sortSelectedLocations();
    $scope.updateLocationList();
    $scope.selectedLocation = "";
  }

  $scope.updateLocationList = function(){
    for (var i_list = 0; i_list < $scope.locationList.length; i_list++) {
      for (var i_location = 0; i_location < $scope.lit.locations.length; i_location++) {
        if ($scope.locationList[i_list]._id === $scope.lit.locations[i_location]._id){
          $scope.locationList.splice(i_list, 1);
        }
      }
    }
  };

  $scope.newFlyer = function(){

    console.log($("#input-title"));
    var formGood = true;

    formGood = $scope.validTitle() && formGood;
    formGood = $scope.validEventDate() && formGood;
    formGood = $scope.validFeatureDate() && formGood;
    formGood = $scope.validLocations() && formGood;
    formGood = $scope.validPicture() && formGood;
    formGood = $scope.validDocFile() && formGood;

    if (!formGood)
      return;

    $('#newLit').modal('hide');
  };


  $scope.validDocFile = function(){
    return true;
  };

  $scope.validEventDate = function(){
    return true;
  };

  $scope.validFeatureDate = function(){
    return true;
  };

  $scope.validLocations = function(){
    return true;
  };

  $scope.validPicture = function(){
    return true;
  };

  $scope.validTitle = function(){
    return true;
  };


  $scope.removeLocation = function(key){
    $scope.locationList.push($scope.lit.locations.splice(key, 1)[0]);
    dataService.sortLocationList($scope.locationList);
  };

  $scope.resetLocations = function(){
    for (var i_location = 0; i_location < $scope.lit.locations.length; i_location++){
      $scope.locationList.push($scope.lit.locations[i_location]);
    }

    dataService.sortLocationList($scope.locationList);
    $scope.lit.locations = [];
  };

  $scope.sortSelectedLocations = function(){
    $scope.lit.locations.sort(function(a,b){
      return a.location.localeCompare(b.location);
    });
  };
})

/*******************************************************************************
 *  Modify Locations Controller
 ******************************************************************************/
.controller('feAdminLocationsModifyCtrl', function($scope, dataService){
  $scope.locationList;
  $scope.pendingList;
  $scope.newLocation;

  dataService.getLocationList(function(res){
    $scope.locationList = res.data;
    dataService.sortLocationList($scope.locationList);
    $scope.initPendingList();
  });

  $scope.addPending = function(){
    $scope.pendingList.push({
      "location": $scope.newLocation,
      "isNew"   : true,
      "editMode": false
    });
    $scope.newLocation = "";
    dataService.sortLocationList($scope.pendingList);
  };

  $scope.applyChanges = function(){
    dataService.saveLocations($scope.pendingList, function(){
      dataService.getLocationList(function(res){
        $scope.locationList = res.data;
        dataService.sortLocationList($scope.locationList);
        $scope.initPendingList();
      });
    });
  };

  $scope.applyEdit = function(key){
    $scope.pendingList[key].location = $scope.pendingList[key].modValue;
    $scope.pendingList[key].editMode = false;
    if (!$scope.pendingList[key].isNew) {
      $scope.pendingList[key].isMod = $scope.checkMod(key);
    }
    dataService.sortLocationList($scope.pendingList);
  };

  $scope.cancelEdit = function(key){
    $scope.pendingList[key].editMode = false;
    if (!$scope.pendingList[key].isNew) {
      $scope.pendingList[key].isMod = $scope.checkMod(key);
    }
  };

  $scope.checkMod = function(pendingKey){
    var id = $scope.pendingList[pendingKey]._id;
    var pendingLocation = $scope.pendingList[pendingKey].location;
    var original = $.grep($scope.locationList, function(location){return location._id === id;})[0];

    if (original.location === pendingLocation)
      return false;
    else
      return true;
  };

  $scope.deleteLocation = function(key){
    if ($scope.pendingList[key].isNew){
      $scope.pendingList.splice(key, 1);
    } else {
      $scope.pendingList[key].isDel = true;
    }
  };

  $scope.discardChanges = function(){
    $scope.initPendingList();
  };

  $scope.editLocation = function(key){
    // console.log("setting editMode for location " + key);
    $scope.pendingList[key].modValue = $scope.pendingList[key].location;
    $scope.pendingList[key].editMode = true;
  };

  $scope.initPendingList = function(){
    $scope.pendingList = [];
    $scope.locationList.forEach(function(location){
      $scope.pendingList.push({
        "_id"     : location._id,
        "location": location.location,
        "isMod"   : false,
        "isDel"   : false,
        "editMode": false
      });
    });
  };
})

/*******************************************************************************
 *  Modify Literature Controller
 ******************************************************************************/
.controller('feAdminModLitCtrl', function($scope){
  var defaults = {
    "isFeatured": false
  }

  $scope.lit = {
    "isFeatured": defaults.isFeatured
  };

  $scope.resetForm = function(blankForm){
    $scope.lit = {
      "isFeatured": defaults.isFeatured
    };
  }
})

;