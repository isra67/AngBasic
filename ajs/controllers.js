/** Controller: main */
app.controller("MainController", function($scope, $http, $location, mainService) {
  
  $scope.thisPageTitle = "My Page Title";
  /** copyright text */
  $scope._my_copyright = "IS (c) 2014";

  $scope.MAIN_QUERY = 'http://apadmin.skimountaineering.sk/api/api-ap-admin.php';

  /** DEMO PAGE ONLY */
  $scope.demo = false;//true;//false;
  
  if ($scope.demo) {
    $scope.userName = 'demoUser';       // user name
    $scope.userPwd = 'demoPwd123';      // pwd
  } else {
    $scope.userName = '';       // user name
    $scope.userPwd = '';        // pwd
  } 

  $scope.loggedIn = false;    // user is logged
  $scope.loggingIn = false;   // logging process 
  
  $scope.loadingData = false; // load data from the server in progress
    
  /** URL redirect */
  $scope.go = function( path ) {
    $location.path( path );
  };
  
  $scope.$on('$routeChangeSuccess', function () {
    var lPath=$location.path();
    if (lPath==null || lPath==='/') return; 
    setTimeout(function() {
      // do something
      console.log('routeChangeSuccess:'+lPath);
      switch (lPath) {
        case '/Login':
          if ($scope.demo) {
            $scope.userName = 'demoUser';       // user name
            $scope.userPwd = 'demoPwd123';      // pwd
          } else {
            $scope.userName = '';       // user name
            $scope.userPwd = '';        // pwd
          }          
          //document.getElementById("_userName").select(); 
          document.getElementById("_userName").focus();
          break;
        case '/ShowList': showRaceList(); break;
      }
    }, 1);
  });
  
  /** show list of races */
  $scope.races = [];
  function showRaceList() {
    var query=$scope.MAIN_QUERY+'?task=racelist';
    $scope.loadingData=true;
    $scope.races = [];
    $http.get(query)
      .then(function(results) { //Success           
          $scope.races=results.data;
        }, function(err) {
          console.log('showRaceList ERR:'+err.status);
      }).finally(function(){$scope.loadingData = false;});
  }
  
  /** onViewLoad */
  $scope.dataSets = null;
  $scope.onViewLoad = function() {
    console.log('onViewLoad');
/*    var headers = {
      'X-ApiKey':'123456'
      //,'Access-Control-Allow-Origin':'*'
      //,'Content-Type':'application/json','Accept':'application/json'
    };
    var config = {
      headers: headers
    };
    $scope.loadingData=true;
    $http.get('http://wda.uienernet.com/PSNHDataAccess/api/leads/', config)
      //.success(function (data, status, headers, config) {
      //    //$scope.getCallCustomHeadersResult = logResult("GET SUCCESS", data, status, headers, config);
      //    $scope.dataSets=data;
      //    $scope.loadingData = false;
      //    console.log('onViewLoad OK');//+angular.fromJson(data));//+' status'+status+' '+headers+' '+config);
      //  })
      //  .error(function (data, status, headers, config) {
      //    $scope.loadingData = false;
      //    console.log('onViewLoad ERR:'+data+' status'+status+' '+headers+' '+config);
      //  });   
        //*
        .then(function(results) {        
          console.log('onViewLoad OK'); //Success
          $scope.dataSets=results.data;
          }, function(err) {
          console.log('onViewLoad ERR:'+err.status+'\n'+err);
        }).finally(function(){$scope.loadingData = false;}); //*/
  };
  
  /** Login */
  $scope.loginTheUser = function(u,p) {
    console.log('Login:'+$scope.userName+'/'+$scope.userPwd+' // '+u+'/'+p);
    /*if ($scope.userName=='') {
      alert('Please enter Login name!');
      document.getElementById("_userName").focus();
      return;
    }
    if ($scope.userPwd=='') {
      alert('Please enter Password!');
      return;
    } //*/

    $scope.loggingIn=true;

    mainService.loginFn(u,p,$scope.demo)
      .then(function(r){
          $scope.loggedIn=true;
          $scope.go('/ShowList');
        },function(r){
          $scope.loggedIn=false;
          alert("Unspecified error!\n"+r);
      })
      .finally(function(){
        $scope.loggingIn=false;
      });  
  };
  /** Logout */
  $scope.logoutUser = function() {
    //console.log('Logout:'+$scope.userName+'/'+$scope.userPwd);
    $scope.userName='';
    $scope.userPwd=''; 
    $scope.loggedIn=false;
    $scope.go('/');
  };

  /** command via diagnostics * /
  $scope.commands = [
		{	val: '', desc: ' --- ' },
		{	val: 'update', desc: 'update APK' },
    {	val: 'updatecfg', desc: 'update CFG' },
    {	val: 'updateall', desc: 'update APK+CFG' },
    {	val: 'rst_db', desc: 'restart DB' },
    {	val: 'rst_tunnel', desc: 'restart tunnel' },
    {	val: 'restart', desc: 'restart APK' },
    {	val: 'reboot', desc: 'tablet reboot' }
    ];
  $scope.selectedCommand = null;
	
  /** clear data from DB older than X days * /
  $scope.clrdata = [ '35', '28', '21', '14' ];
  $scope.selectedClr = $scope.clrdata[1];
  $scope.onClearDiag = function() {
    if ($scope.selectedClr != null && $scope.selectedClr != "") {
      clearDiag($scope.selectedClr);
    }
  };
  $scope.selectedClrChange = function() {
    console.log('selectedClr: ' + $scope.selectedClr);
  };
  
  /** set command for device * /
  $scope.onSetCommandDiag = function() {
    if ($scope.selectedDevice != null && $scope.selectedDevice != "") {
      setCommandDiag($scope.selectedDevice);
    } else {
      alert("Vyberte zariadenie!");
    }
  };
	
  /** device detail * /
  $scope.onShowDiag = function() {
    if ($scope.selectedDevice != null && $scope.selectedDevice != "") {
      $scope.go('/ShowDetail/' + $scope.selectedDevice);
    } else {
      alert("Vyberte zariadenie!");
    }
  };
  $scope.loadDeviceId = function(d) {
    $scope.go('/ShowDetail/' + d.id);
  };
  $scope.loadDevice = function(d) {
    $scope.selectedDevice = d;
    $scope.devicestatus.length = 0;
    $scope.loadingDevice = true; 
    devicesService.getDeviceStatus($scope.selectedDevice).then(function(r){$scope.devicestatus = r;});
  };
  	
  /** all devices status * /
  $scope.loadAllDevicesStatus = function() {
    $scope.selectedDevice = null;
    $scope.devicestatus.length = 0;
    $scope.alldevicesstatus.length = 0; 
    $scope.loadingDevice = false;
    devicesService.getAllDevicesStatus().then(function(r){$scope.alldevicesstatus = r;});
  };//*/
  	
});


/** Controller: user login */ 
app.controller('LoginController', function($scope, mainService) {
  $scope.loginUser = function() { $scope.loginTheUser($scope.userName,$scope.userPwd); };
});

/** Controller: display detail */
app.controller('ShowDetailController', function($scope, $routeParams) {
  console.log('ShowDetailController:'+$routeParams.id);
  if (!$scope.loggedIn) $scope.go('/');
});
 
 
/** Controller: display list */ 
app.controller('ShowListController', function($scope, mainService) {
  console.log('ShowListController'); 
  if (!$scope.loggedIn) $scope.go('/');

  /** zobrazenie registrovanych pretekarov na pretek */
  $scope.raceRacers = [];
  $scope.selectedRace = 0;
  $scope.zobrazenieRegistrovanych = function() {
//    console.log('zobrazenieRegistrovanych:'+$scope.selectedRace);
    
    $scope.raceRacers=[];
    $scope.loadingData=true;

    mainService.getAllRaceRacers($scope.MAIN_QUERY,$scope.selectedRace)
      .then(function(r){$scope.raceRacers = r;})
      .finally(function(){$scope.loadingData = false;});
  }
  
});