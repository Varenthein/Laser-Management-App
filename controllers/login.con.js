angular.module('FreshtexRM').controller('loginController',function($scope, $rootScope, $http) {

   $scope.error = false; //default error status
   $scope.Login = ""; //just defined variable
   $scope.Password = ""; //just defined variable


    /* Check Login function */
    $scope.checkLogin = function() {

    $scope.error = "loading"; //show loading msg, if set to loading ng-show shows the alert

    // Api request, log in user
    $http({
      method: 'GET',
      url: $rootScope.APIurl+'user.api.php?get=login&pass='+Sha256.hash($scope.Password)+"&login="+$scope.Login
    }).then(function successCallback(response) { //if connected to api

          $scope.error = false; // there is no error and no loading

          if(response.data != "error" && response.data.name) { //if autehntication goes ok. We got user data

               $scope.user = response.data; //load user data to "user"

               $scope.error = false; //no error

               //Setting session
               $rootScope.logged = true;
               $rootScope.login = $scope.user.name;
               $rootScope.password = $scope.user.password;
               $rootScope.ID = $scope.user.id;
               $rootScope.user = $scope.user;

               //turn of WelcomeBoz
               jQuery('#fadeBox, #welcomeBox').fadeOut('slow');
               window.location = "#/index"; //redirecting to start screen
            }


         if($rootScope.logged != true) { //if something went wrong, user is not logged

           $scope.error = true; //eror

          }


      });


  }

});
