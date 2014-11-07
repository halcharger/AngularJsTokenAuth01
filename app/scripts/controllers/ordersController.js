'use strict';
app.controller('ordersController', ['$scope', 'ordersService', function ($scope, ordersService) {

  $scope.orders = [];
  $scope.message = '';

  ordersService.getOrders().then(function (results) {

    $scope.orders = results.data;

  }, function (error) {
    $scope.message = 'Unexpected error encountered: ' + error.data.message;
  });

}]);
