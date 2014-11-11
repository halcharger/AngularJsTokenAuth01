'use strict';

var app = angular.module('angularJsbearerTokenAuthwebApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar']);

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptorService');
});

app.config(function ($routeProvider) {

  $routeProvider.when('/home', {
    controller: 'homeController',
    templateUrl: '/views/home.html'
  });

  $routeProvider.when('/login', {
    controller: 'loginController',
    templateUrl: '/views/login.html'
  });

  $routeProvider.when('/signup', {
    controller: 'signupController',
    templateUrl: '/views/signup.html'
  });

  $routeProvider.when('/orders', {
    controller: 'ordersController',
    templateUrl: '/views/orders.html'
  });

  $routeProvider.when('/tokens', {
    controller: 'tokensManagerController',
    templateUrl: '/views/tokens.html'
  });

  $routeProvider.when("/associate", {
    controller: "associateController",
    templateUrl: "/views/associate.html"
  });

  $routeProvider.otherwise({ redirectTo: '/home' });
});

app.constant('serverApiSettings', {
  serverBaseUri: 'http://localhost:51324/',
  blahserverBaseUri: 'http://webapi2withtokenauthentication01.azurewebsites.net/',
  client_id: 'ngAuthApp'
});

app.run(['authService', function (authService) {
  authService.fillAuthData();
}]);
