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
