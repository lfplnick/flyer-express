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



angular.module('feAdmin', [])

.controller('mainCtrl', function($scope){
})

.controller('feAdminAddLitCtrl', function($scope, $http, dataService){
  console.log("this isn't the console you're looking for...");
  $scope.defaults = {
    "type": "flyer",
    "format": "",
    "isOngoing": false,
    "dateEvent": new Date(),
    "isFeatured": false,
    "dateExpires": new Date(),
    "locations": [{"id":-1, "location": ""}],
    "thumb": "empty.jpg",
    "thumbFile": ""
  };

  dataService.getFormats(function(res){
    $scope.formats = res.data;
    $scope.defaults.format = $scope.formats[2];
    $scope.resetForm();
  });

  dataService.getLocationList(function(res){
    $scope.locationList = res.data;
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

  $scope.resetForm = function(){
    $scope.lit = {
      "type": $scope.defaults.type,
      "format": $scope.defaults.format,
      "isOngoing": $scope.defaults.isOngoing,
      "dateEvent": $scope.defaults.dateEvent,
      "isFeatured": $scope.defaults.isFeatured,
      "dateExpires": $scope.defaults.dateExpires,
      "locations": [{"id":-1, "location": ""}],
      "thumb": $scope.defaults.thumb,
      "thumbFile": $scope.defaults.thumbFile
    };

    // $scope.lit.locations.push($scope.locationList[0]);
    // $scope.lit.locations.push($scope.locationList[1]);
    
  };

  $scope.addLocationSelector = function(key){
    // $scope.lit.locations.push($scope.locationList[key]);
    var length = $scope.lit.locations.length;
    if ($scope.lit.locations[length - 1].location !== '') {
      $scope.lit.locations.push({"id":-1, "location": ""});
    }
    // $scope.lit.locations.unshift($scope.locationList.splice(key, 1));    
  };

  $scope.rmLocationSelector = function(key){
    if ($scope.lit.locations.length > 1) {
      $scope.lit.locations.splice(key, 1);
    } else {
      $scope.lit.locations = [{"id":-1, "location":''}];
    }
  };

  $scope.resetLocations = function(){
    $scope.lit.locations = [{"id":-1, "location": ""}];
  };
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
    $http.get('/mock/locationList.json').then(cb);
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
