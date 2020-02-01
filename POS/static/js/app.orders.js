app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.orders', {
      url: "/orders",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.deliveryCenter.default.html',
          controller: 'businessManagement.deliveryCenter.default',
        },
      }
    }).state('businessManagement.orders.recent', {
      url: "/recent",
      templateUrl: '/static/ngTemplates/app.orders.recent.html',
      controller: 'orders.recent'
    }).state('businessManagement.orders.quotations', {
      url: "/quotations",
      templateUrl: '/static/ngTemplates/app.orders.quotations.html',
      controller: 'orders.quotations'
    }).state('businessManagement.orders.wip', {
      url: "/wip",
      templateUrl: '/static/ngTemplates/app.orders.wip.html',
      controller: 'orders.wip'
    }).state('businessManagement.orders.shipped', {
      url: "/shipped",
      templateUrl: '/static/ngTemplates/app.orders.shipped.html',
      controller: 'orders.shipped'
    }).state('businessManagement.orders.history', {
      url: "/history",
      templateUrl: '/static/ngTemplates/app.orders.history.html',
      controller: 'orders.history'
    }).state('businessManagement.orders.createOrder', {
      url: "/createOrder",
      templateUrl: '/static/ngTemplates/app.orders.createOrder.html',
      controller: 'orders.createOrder'
    }).state('businessManagement.orders.createQuotation', {
      url: "/createQuotation",
      templateUrl: '/static/ngTemplates/app.orders.createQuotation.html',
      controller: 'orders.createQuotation'
    })
});

app.controller("orders.createQuotation", function($scope, $http, Flash, $rootScope, $filter, $uibModal, $window) {
  $scope.showInput = false
  $scope.openInput = function() {
    $scope.showInput =! $scope.showInput
  }
})
app.controller("orders.createOrder", function($scope, $http, Flash, $rootScope, $filter, $uibModal, $window) {

})
app.controller("orders.history", function($scope, $http, Flash, $rootScope, $filter, $uibModal, $window) {

})
app.controller("orders.shipped", function($scope, $http, Flash, $rootScope, $filter, $uibModal, $window) {

})
app.controller("orders.wip", function($scope, $http, Flash, $rootScope, $filter, $uibModal, $window) {

})
app.controller("orders.quotations", function($scope, $http, Flash, $rootScope, $filter, $uibModal, $window) {

})
app.controller("orders.recent", function($scope, $http, Flash, $rootScope, $filter, $uibModal, $window) {

})

app.controller("businessManagement.deliveryCenter.default", function($scope, $http, Flash, $rootScope, $filter, $uibModal, $window) {


});
