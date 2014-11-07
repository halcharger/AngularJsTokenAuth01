'use strict';
app.controller('tokensManagerController', ['$scope', 'tokensManagerService', function ($scope, tokensManagerService) {

  $scope.refreshTokens = [];
  $scope.message = '';

  tokensManagerService.getRefreshTokens().then(function (results) {

    $scope.refreshTokens = results.data;

  }, function (error) {
    $scope.message = error.data.message;
  });

  $scope.deleteRefreshTokens = function (index, tokenid) {

    tokenid = window.encodeURIComponent(tokenid);

    tokensManagerService.deleteRefreshTokens(tokenid).then(function () {

      $scope.refreshTokens.splice(index, 1);

    }, function (error) {
      $scope.message = error.data.message;
    });
  };

}]);
