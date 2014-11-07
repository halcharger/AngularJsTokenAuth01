'use strict';
app.factory('authService', ['$q', 'localStorageService', 'serverApiSettings', function ($q, localStorageService, serverApiSettings) {

  var serviceBase = serverApiSettings.serverBaseUri;
  var authServiceFactory = {};

  var _authentication = {
    isAuth: false,
    userName : '',
    userRefreshTokens: false
  };

  var _saveRegistration = function (registration) {

    _logOut();

    $http = $http || $injector.get('$http');
    return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
      return response;
    });

  };

  var _login = function (loginData) {

    var data = 'grant_type=password&username=' + loginData.userName + '&password=' + loginData.password;

    if (loginData.useRefreshTokens){
      data = data + '&client_id=' + serverApiSettings.client_id;
    }

    var deferred = $q.defer();

    $http = $http || $injector.get('$http');
    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

      if (loginData.userRefreshTokens){
        localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, userRefreshTokens: true });
      }
      else{
        localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: '', userRefreshTokens: false });
      }

      _authentication.isAuth = true;
      _authentication.userName = loginData.userName;
      _authentication.userRefreshTokens = loginData.userRefreshTokens;

      deferred.resolve(response);

    }).error(function (err) {
      _logOut();
      deferred.reject(err);
    });

    return deferred.promise;

  };

  var _logOut = function () {

    localStorageService.remove('authorizationData');

    _authentication.isAuth = false;
    _authentication.userName = '';
    _authentication.userRefreshTokens = false;

  };

  var _fillAuthData = function () {

    var authData = localStorageService.get('authorizationData');
    if (authData)
    {
      _authentication.isAuth = true;
      _authentication.userName = authData.userName;
      _authentication.userRefreshTokens = authData.userRefreshTokens;
    }

  };

  var _refreshToken = function(){

    var deferred = $q.defer();

    var authData = localStorageService.get('authorizationData');

    if (authData && authData.userRefreshTokens){

      var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + serverApiSettings.client_id;

      localStorageService.remove('authorizationData');

      $http = $http || $injector.get('$http');
      &http.post(serverApiSettings.serverBaseUri + 'token', data, {headers: {'content-type': 'application/x-www-form-urlencodeed'} }).success(function(){

        localStorageService.set('authorizationData', {token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

        deferred.resolve(response);

      }).error(function(){
        deferred.reject();
      });

    } else{
      deferred.reject();
    }

    return deferred.promise;

  };

  authServiceFactory.saveRegistration = _saveRegistration;
  authServiceFactory.login = _login;
  authServiceFactory.logOut = _logOut;
  authServiceFactory.fillAuthData = _fillAuthData;
  authServiceFactory.authentication = _authentication;
  authServiceFactory.refreshToken = _refreshToken();

  return authServiceFactory;
}]);
