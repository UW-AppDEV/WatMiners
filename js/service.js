/**
 * Created by Han Chen on 24/02/2015.
 */
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
    //data checking
    for(var j=0;j<rankings.length;j++){
      if(rankings[j].jobID.length!==8 || isNaN(rankings[j].jobID)){
        onError("Please check if your jobID is the right format before submitting");
        return;
      }else if(isNaN(rankings[j].preference) || rankings[j].preference<-1 || rankings[j].preference>9){
        onError("Please check if your preference is the right format before submitting");
        return;
      }
      for(var k=0;k<j;k++){
        if(rankings[j].jobID==rankings[k].jobID)
        {
          onError("You have duplicate jobID");
          return;
        }
      }
    }
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
        if (onError) onError("there is an error submitting your rankings, perhaps your data format is invalid");
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
}]);