'use strict';
app.factory('authService', ['$q', '$injector', 'localStorageService', 'serverApiSettings', function ($q, $injector, localStorageService, serverApiSettings) {

  var serviceBase = serverApiSettings.serverBaseUri;
  var $http;
  var authServiceFactory = {};

  var _authentication = {
    isAuth: false,
    userName : '',
    useRefreshTokens: false
  };

  var _externalAuthData = {
    provider: '',
    userName: '',
    email: '',
    externalAccessToken: ''
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

    $http = $http || $injector.get('$http');
    return $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .success(function (response) {

      if (loginData.useRefreshTokens){
        localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
      }
      else{
        localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: '', useRefreshTokens: false });
      }

      _authentication.isAuth = true;
      _authentication.userName = loginData.userName;
      _authentication.useRefreshTokens = loginData.useRefreshTokens;

    })
      .error(function () {
      _logOut();
    });
  };

  var _logOut = function () {

    localStorageService.remove('authorizationData');

    _authentication.isAuth = false;
    _authentication.userName = '';
    _authentication.useRefreshTokens = false;

  };

  var _fillAuthData = function () {

    var authData = localStorageService.get('authorizationData');
    if (authData)
    {
      _authentication.isAuth = true;
      _authentication.userName = authData.userName;
      _authentication.useRefreshTokens = authData.useRefreshTokens;
    }

  };

  var _refreshToken = function(){

    var deferred = $q.defer();

    var authData = localStorageService.get('authorizationData');

    if (authData && authData.useRefreshTokens){

      var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + serverApiSettings.client_id;

      localStorageService.remove('authorizationData');

      $http = $http || $injector.get('$http');
      $http.post(serverApiSettings.serverBaseUri + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function(response){
        localStorageService.set('authorizationData', {token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

        deferred.resolve(response);

      }).error(function(error){
        deferred.reject();
      });

    } else{
      deferred.reject();
    }

    return deferred.promise;

  };

  var _obtainAccessToken = function (externalData) {

    var deferred = $q.defer();

    $http = $http || $injector.get('$http');
    $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

      localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

      _authentication.isAuth = true;
      _authentication.userName = response.userName;
      _authentication.useRefreshTokens = false;

      deferred.resolve(response);

    }).error(function (err, status) {
      _logOut();
      deferred.reject(err);
    });

    return deferred.promise;

  };

  var _registerExternal = function (registerExternalData) {

    //var deferred = $q.defer();

    $http = $http || $injector.get('$http');
    return $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

      localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

      _authentication.isAuth = true;
      _authentication.userName = response.userName;
      _authentication.useRefreshTokens = false;

      //deferred.resolve(response);

    }).error(function (err, status) {
      _logOut();
      //deferred.reject(err);
    });

    //return deferred.promise;

  };

  authServiceFactory.saveRegistration = _saveRegistration;
  authServiceFactory.login = _login;
  authServiceFactory.logOut = _logOut;
  authServiceFactory.fillAuthData = _fillAuthData;
  authServiceFactory.authentication = _authentication;
  authServiceFactory.refreshToken = _refreshToken;

  authServiceFactory.obtainAccessToken = _obtainAccessToken;
  authServiceFactory.externalAuthData = _externalAuthData;
  authServiceFactory.registerExternal = _registerExternal;

  return authServiceFactory;
}]);
