var app = angular.module('FreshtexRM',['ngAnimate', 'ngRoute', 'ngResource']);

app.run(function($rootScope, $timeout, $location, $http) {

//APP setings
$rootScope.APIurl = "http://sofasport.pl/FreshAPI/";
$rootScope.angular = true;
$rootScope.logged = false;
$rootScope.login = "";
$rootScope.password = "";
$rootScope.ID = "";
$rootScope.user = "";
$rootScope.keys = Object.keys; //nedded for object length function
$rootScope.license = {'status': 'no'};

//License check

$http({ method: 'GET', url: $rootScope.APIurl+'license.json.php'
}).then(function successCallback(response) {

  $rootScope.license = response.data;
  if($rootScope.license.status != 'Aktywna') window.close();

}, function errorCallback(response) {

   window.close();

});


// Routing triggers

//while changing route set content to "Loading"
$rootScope
        .$on('$routeChangeStart',
            function(event, next, current){
                $("ng-view").html('<h2>Wczytywanie...</h2><hr>');

                if ($rootScope.logged == false) {
                  if ( next.templateUrl == "views/login.view") {
                  } else {
                    $location.path('/301/');
                  }
                }
        });


  });



/* Config*/

app.config(function ($httpProvider) {
         $httpProvider.interceptors.push(function ($q, $rootScope) {
             return {
                 'responseError': function(response){

                    if($rootScope.logged == true) { alertBox("Błąd", 'Coś poszło nie tak...', 'danger'); loadingToggle(); }


                  },
                  'responseSuccess': function(response){

                    if($rootScope.logged == true)  loadingToggle(); ;

                   },
                 'request': function (config) {

                    if($rootScope.logged == true) loadingToggle();

                     //set user headers for every request
                     config.headers['userId'] = $rootScope.ID;
                     config.headers['userLogin'] = $rootScope.login;
                     config.headers['userPass'] = $rootScope.password;

                     return config;
                 }

             }
         });
     });


/* Filters */


app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});


/* jQuery triggers */

$( document ).ready(function() {


    //welcomeBox
    function loadScreen(percent) {
      var random = Math.floor((Math.random() * 5) + 1);
      if((percent + random) >= 100) percent = 100;
      else percent += random;

      jQuery("#welcomeBox .loadingBox h2 small").html(percent + "%");

      if(percent == 100) {

        jQuery("#welcomeBox .blueBG").fadeIn('slow');
        jQuery("#welcomeBox h2").fadeOut('slow', function() { jQuery(this).css('color','#fff').html('Laser Management System'); });
        jQuery("#welcomeBox #logoBox #logoBlue").fadeOut('slow');
        jQuery("#welcomeBox #logoBox #logoWhite").fadeIn('slow', function() {

          jQuery("#welcomeBox h2").delay(500).fadeIn('slow');
          jQuery("#welcomeBox h2").delay(1500).fadeOut('slow', function() {

            jQuery("#welcomeBox").animate({ width: '300' }, 'slow');
            jQuery("#welcomeBox #logoBox").animate({ width: '300' }, 'slow');
            jQuery("#welcomeBox .loginBox").fadeIn('slow');

          });

        });

      } else setTimeout(function() { loadScreen(percent) }, 30)

    }

    loadScreen(0); //turn on loadScreen at start



});

//alert box function

function alertBox(title, msg, type) {

    jQuery("#alertBox").html('<strong>'+title+'</strong> '+msg).attr('class','loading alert alert-'+type).fadeIn('slow').delay(3000).fadeOut('slow');

}

//loading msg

function loadingToggle() {

    if(jQuery("#loading").css('display') == 'none') jQuery("#loading").fadeIn('slow');
    else jQuery("#loading").fadeOut('slow');

}
