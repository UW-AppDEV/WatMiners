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