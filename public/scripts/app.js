'use strict';

angular.module('todoListApp', [])

.controller('mainCtrl', function($scope, dataService){
  dataService.getTodos(function(response){
    // var todos = response.data;  
    // $scope.todos =  todos;
    $scope.todos = response.data;
    });
  
  $scope.addTodo = function() {
    $scope.todos.unshift({name: "This is a new todo.",
                      completed: false});
  };})
.controller('todoCtrl', function($scope, dataService) {
  $scope.deleteTodo = function(todo, index) {
    $scope.todos.splice(index, 1);
    dataService.deleteTodo(todo);
  };
  
  $scope.saveTodos = function() {
    var filteredTodos = $scope.todos.filter(function(todo){
      if(todo.edited) {
        return todo
      };
    })
    dataService.saveTodos(filteredTodos);
  };})
.directive('todo', function(){
  return {
    templateUrl: '/templates/todo.html',
    replace: true,
    controller: 'todoCtrl'
  }})
.service('dataService', function($http) {
  this.getTodos = function(cb) {
    $http.get('/mock/todos.json').then(cb);
  };
  
  this.deleteTodo = function(todo) {
    console.log("I deleted the " + todo.name + " todo!");
  };
  
  this.saveTodos = function(todos) {
    console.log("I saved " + todos.length + " todos!");
  };})
;



angular.module('feAdmin', ['ui.bootstrap'])

.controller('mainCtrl', function($scope){
})

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
        if ($scope.locationList[i_list].id === $scope.lit.locations[i_location].id){
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

.controller('feAdminLocationsModifyCtrl', function($scope, dataService){
  $scope.locationList;
  dataService.getLocationList(function(res){
    $scope.locationList = res.data;
    dataService.sortLocationList($scope.locationList);
  });
})

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

.directive('feAdminTopNav', function(){
  return {
    templateUrl: '/templates/admin-top-nav.html',
    replace: true
  }
})

.directive('feAddLitModal', function(){
  return {
    templateUrl: '/templates/add-lit-modal.html',
    scope: {},
    controller: 'feAdminAddLitCtrl',
    replace: false
  }
})

.directive('feModLitModal', function(){
  return {
    templateUrl: '/templates/mod-lit-modal.html',
    scope: {},
    controller: 'feAdminModLitCtrl',
    replace: false
  }
})

.directive('feModalLocationsModify', function(){
  return {
    templateUrl: '/templates/modal-locations-modify.html',
    scope: {},
    controller: 'feAdminLocationsModifyCtrl',
    replace: false
  };
})

.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])

;
