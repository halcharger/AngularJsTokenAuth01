﻿'use strict';
app.factory('tokensManagerService', ['$http','serverApiSettings', function ($http, serverApiSettings) {

  var serviceBase = serverApiSettings.serverBaseUri;

  var tokenManagerServiceFactory = {};

  var _getRefreshTokens = function () {

    return $http.get(serviceBase + 'api/refreshtokens').then(function (results) {
      return results;
    });
  };

  var _deleteRefreshTokens = function (tokenid) {

    return $http.delete(serviceBase + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
      return results;
    });
  };

  tokenManagerServiceFactory.deleteRefreshTokens = _deleteRefreshTokens;
  tokenManagerServiceFactory.getRefreshTokens = _getRefreshTokens;

  return tokenManagerServiceFactory;

}]);
