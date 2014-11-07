'use strict';
app.factory('ordersService', ['$http', 'serverApiSettings', function ($http, serverApiSettings) {

  var serviceBase = serverApiSettings.serverBaseUri;
  var ordersServiceFactory = {};

  var _getOrders = function () {

    return $http.get(serviceBase + 'api/orders').then(function (results) {
      return results;
    });
  };

  ordersServiceFactory.getOrders = _getOrders;

  return ordersServiceFactory;

}]);
