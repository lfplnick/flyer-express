'use strict';

angular.module('feAdmin')

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