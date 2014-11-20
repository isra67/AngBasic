app.factory("mainService", function($q, $http) {
    var _url = "getdiag.php";

    /** Log In */
    var _loginFn = function(u,p,demo) {
      console.log('LoginService:'+u+'/'+p+'/'+demo);
      var deferred = $q.defer();
      
      setTimeout(function() {
        if (u==='miro' && p==='miro1' || demo) deferred.resolve("OK");
        else deferred.reject('Chybne meno alebo heslo!');
      }, 100); 
      
/*      
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
          });//*/   
          
      return deferred.promise;
    };
    
    var _getAllRaceRacers = function(query,id) {
      var deferred = $q.defer();
    
      $http.post(query,{task:'raceracerslist',pretekid:id})
        .then(function(results) { //Success       
            deferred.resolve(results.data);
          }, function(err) {
            console.log('raceracerslist ERR:'+err.status);
            deferred.reject(err.status);
        });
        
      return deferred.promise;
    };
 
    return {
      loginFn: _loginFn,
      getAllRaceRacers: _getAllRaceRacers
    };
});