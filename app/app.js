/**
 * Created by Han Chen on 24/02/2015.
 */
var app=angular.module('app',["ui.router","ui.bootstrap","firebase"])
  .run( function( $rootScope ) {
    // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.
    // Load the facebook SDK asynchronously
    /*(function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));*/
  });
/**
 * Created by Han Chen on 24/02/2015.
 */
app.config(["$stateProvider","$urlRouterProvider",function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      controller: "IntroCtrl",
      templateUrl: 'template/intro.html'
    })
    .state('ranking-input', {
      url: '/ranking-input',
      controller:"InputCtrl",
      templateUrl:'template/ranking-input.html'
    })
    .state('about',{
      url: '/about',
      templateUrl:'template/about.html'
    })
    .state('ranking-display', {
      url: '/ranking-display',
      controller:"DisplayCtrl",
      templateUrl:'template/ranking-display.html'
    });
}]);
/**
 * Created by Han Chen on 24/02/2015.
 */
app.controller("InputCtrl", ["$scope", "$rootScope","$service","$state", "$stateParams","$firebase",
  function ($scope,$rootScope,$service,$state,$stateParams,$firebase) {
    if($service.authData===null){
      $state.go("home");
    }
    else {
      /*var sync = $firebase(new Firebase("https://watminers.firebaseio.com/jobs")).$asObject();
       sync.$loaded().then(function(){
       console.log(sync);
       }).catch(function(err){console.log(err);});*/
      $service.didUserRank(onRanked,function(){$scope.isLoading=false});
      $scope.isLoading=true;
      function onRanked(){$state.go("ranking-display");}
      $scope.rankings = [];
      function createItem() {
        return {
          jobID: "",
          ranking: "Ranked",
          preference: 0
        };
      }
      //initiating rankings
      for (var i = 0; i < 3; i++) {
        $scope.rankings.push(createItem());
        console.log($scope.rankings);
      }
      $scope.addAnother = function () {
        $scope.rankings.push(createItem());
      };
      $scope.deleteRecord = function ($index) {
        $scope.rankings.splice($index, 1);
      };
      $scope.submit = function () {
        var onSuccess = function () {
          $state.go("ranking-display");
        };
        var onError = function (errorMessage) {
          $scope.message = errorMessage;
        };
        console.log($scope.rankings);
        $service.addRankings(angular.copy($scope.rankings), onSuccess, onError);
      };
    }
  }])
  .controller("IntroCtrl",["$scope", "$rootScope","$state", "$stateParams","$firebaseAuth","$service",
    function ($scope,$rootScope,$state,$stateParams,$firebaseAuth,$service) {

      $scope.login=function(){
        var onSuccess=function(){
          $state.go("ranking-input");
        };
        var onError=function(err){
          alert(err);
        };
        $service.login(onSuccess,onError);
        /*$service.ref = new Firebase("https://watminers.firebaseio.com");
         $service.authObj = $firebaseAuth($service.ref);
         $service.authObj.$authWithOAuthPopup("facebook").then(function(authData) {
         $service.authData=authData;
         console.log("Logged in as:", authData); //for debug
         if(onSuccess) onSuccess();
         $service.ref.goOffline();
         }).catch(function(error) {
         console.error("Authentication failed:", error);
         });*/
      };
    }])

  .controller("DisplayCtrl",["$scope", "$rootScope","$service","$state", "$stateParams",
    function ($scope,$rootScope,$service,$state,$stateParams) {
      if(!$service.authData){
        $state.go('home');
      }else {
        $scope.rankings = [];
        function isArray(obj) {
          return Object.prototype.toString.call(obj) === '[object Array]';
        }

        $service.getRankings(function (res) {
          console.log(res);
          for(var i=0;i<res.length;i++){
            $scope.rankings.push(res[i]);
          }
          /* this code was for syncing the rankings data, obsolete now
           //reorganize res
           var ownRanking = res[_.findIndex(res,function(i){return i.$id==$service.authData.uid;})];
           var jobs=[];
           for(var i=0;i<res.length;i++){
           for(var j=0;j<res[i].length;j++){
           for(var k=0;k<ownRanking.length;k++){
           if(res[i][j].jobID==ownRanking[k].jobID){
           jobs.push(res[i][j]);
           }
           }
           }
           }*/
        }, function (error) {
          console.log(error);
          $state.go("home");
        });
      }
    }]);
app.service("$service",["$http","$firebaseAuth","$firebase","$timeout",
  function($http,$firebaseAuth,$firebase,$timeout){
    var service=this;
    this.firebaseURL = "https://watminers.firebaseio.com";
    this.refRanking=new Firebase(service.firebaseURL);
    this.authObj=$firebaseAuth(service.refRanking);
    this.rankings=null;
    this.refJob=null;
    this.syncRanking=null;
    this.authData=this.authObj.$getAuth();
    Firebase.goOffline();
    this.login=function(onSuccess,onError){
      Firebase.goOnline();
      service.authObj.$authWithOAuthPopup("facebook").then(function(authData) {
        service.authData=authData;
        console.log("Logged in as:", authData); //for debug
        Firebase.goOffline();
        if(onSuccess) onSuccess();
      }).catch(function(error) {
        Firebase.goOffline();
        console.error("Authentication failed:", error);
        if (onError) onError("login failed, try referesh the page");
      });
    };

    //TODO didUserRank() boolean
    this.didUserRank=function(onRanked,onNotRanked){
      Firebase.goOnline();
      var ref = new Firebase(service.firebaseURL +"/rankings/"+service.authData.uid);
      var sync=$firebase(ref).$asArray();
      sync.$loaded().then(function(){
        Firebase.goOffline();
        console.log(sync);
        if( sync.length>0)
        {
          service.rankings=sync[0];
          if (onRanked) onRanked();
        }else if(onNotRanked){
          onNotRanked();
        }
      }).catch(function(error){
        Firebase.goOffline();
        if(onNotRanked){
          onNotRanked();
        }
      });
    };
    //TODO addRankings() @param userdata onSuccess, onError
    this.addRankings=function(rankings,onSuccess,onError){
      Firebase.goOnline();
      console.log(rankings);
      var lastSync=null;
      //service.syncRanking=$firebase(service.refRanking); //initialize syncing
      for(var i=0;i<rankings.length;i++){
        console.log(rankings[i]);
        rankings[i].displayName=service.authData.facebook.displayName;
        rankings[i].jobID+="";
        var sync2 = $firebase(new Firebase(service.firebaseURL+"/jobs/"+rankings[i].jobID));
        lastSync=sync2.$set(service.authData.uid,rankings[i]).catch(function(err){
          if (onError) onError();
          console.log(err);
        });
      }
      /*service.syncRanking.$set(service.authData.uid,rankings).then(function(ref){},function(error){
       console.log(error);
       });*/
      lastSync.then(addToRankings);
      function addToRankings() {
        var ref1 = new Firebase(service.firebaseURL+"/rankings/"+service.authData.uid);
        var sync1=$firebase(ref1).$asArray();
        sync1.$add(rankings).then(function (ref) {
          Firebase.goOffline();
          if (onSuccess) onSuccess();

        }, function (error) {
          console.log(error);
          Firebase.goOffline();
          if (onError) onError();
        });
      }
      /*if(!service.refJob){
       service.refJob=new Firebase("https://watminers.firebaseio.com/jobs");
       //do something
       }*/
    };
    this.getRankings=function(onSuccess,onError){

      //users rankings are successfully retrieved
      if(!service.rankings) service.didUserRank(onGetRanking,onError);
      else onGetRanking();
      function onGetRanking() {
        Firebase.goOnline();
        console.log(service.rankings);
        for (var i = 0; i < service.rankings.length; i++) {
          (function(){
            var p=i;
            var sync = $firebase(new Firebase(service.firebaseURL + "/jobs/" + service.rankings[i].jobID)).$asArray();
            sync.$loaded().then(function () {
              //console.log(sync);
              if(p===service.rankings.length-1) Firebase.goOffline();
              if (onSuccess) onSuccess(sync);
            }).catch(function (error) {
              if(p===service.rankings.length-1) Firebase.goOffline();
              console.log(error);
            });})();
        }
      }

    };
  }]);;
