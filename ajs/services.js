app.factory("mainService", function($q, $http) {
    var _url = "getdiag.php";

    /** Log In */
    var _loginFn = function(u,p,demo) {
      var deferred = $q.defer();
      console.log('LoginService:'+u+'/'+p+'/'+demo);
      
      $http.post(_url,{task:'login',u:u,p:p})
        .then(function(results) {        
            //Success
            //angular.copy(results.data, _devices); //this is the preferred; instead of $scope.movies = result.data
            //deferred.resolve(_devices);
            deferred.resolve("OK");
          }, function(err) {
            console.log('ERR:'+err.status+'\n'+err.data);

            if (demo) {
              setTimeout(function() {
                deferred.resolve("OK");
              }, 300); 
            } else {             
              deferred.reject(err.status);
            }        
          });
          
      return deferred.promise;
    };
 
    return {
      loginFn: _loginFn
    };
});