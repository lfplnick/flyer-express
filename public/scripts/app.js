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

.controller('feAdminAddLitCtrl', function($scope, dataService){
  $scope.defaults = {
    "featured": false,
    "format": "",
    "type": "form"
  };

  dataService.getFormats(function(res){
    $scope.formats = res.data;
    $scope.defaults.format = $scope.formats[2];
    $scope.resetForm();
  });

  $scope.resetForm = function(blankForm){
    $scope.lit = {
      "featured": $scope.defaults.featured,
      "format": $scope.defaults.format,
      "type": $scope.defaults.type
    };
  }
})

.controller('feAdminModLitCtrl', function($scope){
  var defaults = {
    "featured": false
  }

  $scope.lit = {
    "featured": defaults.featured
  };

  $scope.resetForm = function(blankForm){
    $scope.lit = {
      "featured": defaults.featured
    };
  }
})

.service('dataService', function($http){
  this.getFormats = function(cb){
    $http.get('/mock/formats.json').then(cb);
  }
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

;
