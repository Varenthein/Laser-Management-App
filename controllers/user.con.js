angular.module('FreshtexRM').controller('userController',function($scope, $rootScope, $http) {



     //Ajax request for getting list of users

     $scope.getUsers = function() {

     $http({
         method: 'GET',
         url: $rootScope.APIurl+'user.api.php?get=all'
          }).then(function successCallback(response) {

              $scope.users = response.data;

           });

   }

    $scope.getUsers();

     /* Sorting records */

     //I'm setting default values for sorting

     $scope.orderRecords = '$index'; //order by $index, which bassically left things sorted by server-side (so it's by date)
     $scope.orderRecordsReverse = false; //order in the normal manner

     $scope.setRecordsOrder = function(orderBy) {

        if($scope.orderRecords == orderBy) $scope.orderRecordsReverse = ($scope.orderRecordsReverse) ? false : true; //if you click ordering by the same value second time, it makes ordering reversed
        $scope.orderRecords = orderBy; //set order by for given value

     }

     /* END OF sorting records */

     /* ADD USER */

     $scope.addUser = function() {

       var i = $scope.users.length;

       console.log($scope.pracownik);
       $scope.invalidName = false;

       while (i--) { if($scope.pracownik.name == $scope.users[i].name) $scope.invalidName = true; } //loop for users and check if chosen login isn;t already in use

       if($scope.invalidName == true) alertBox("Błąd", "Taki uzytkownik juz istnieje", "danger");
       else if($scope.pracownik.pass != $scope.pracownik.repass)  alertBox("Błąd", "Hasła nie są takie same!", "danger");
       else if($scope.pracownik.pass.length < 6)  alertBox("Błąd", "Hasło musi mieć przynajmniej 6 liter!", "danger");
       else {

       $http({
           method: 'POST',
             url: $rootScope.APIurl+'user.api.php?get=addUser',
               data:  $scope.pracownik //new object
             }).then(function successCallback(response) {

                    if(response.data == "success") {  //if success

                        alertBox('Sukces!','Uzytkownik został dodany!','success');

                        //Let's clear all variables

                        $scope.pracownik.name = "";
                        $scope.pracownik.status = "";
                        $scope.pracownik.pass = "";
                        $scope.pracownik.repass = "";

                        $scope.getUsers(); //refresh records

                 }
                 else  alertBox("Błąd", "Coś poszło nie tak...", "danger");


         });

      }

    }

     /* END OF ADD USER */


     /* Removing users */

     $scope.userToDelete; // variable that holds info about item we want to delete (eg. id)

     //This function sets recordToDelete variable by getting data from ng-repeat
     $scope.setToDel = function(item) {

            $scope.userToDelete = item;

     }

     //actual removing function
     $scope.deleteUser = function(item) {

       //ajax request to back-end
       $http({
           method: 'GET',
             url: $rootScope.APIurl+'user.api.php?get=deleteUser&id='+item.id,
             }).then(function successCallback(response) {

                   $scope.getUsers(); //on success load records again
                   alertBox('Sukces!','Uzytkownik został usunięty!','success');

             });

       }

       /* END OF removing users */


       /* Edit users */

       //Set empty object
       $scope.worker = { 'id': '', 'name': '', 'pass': '', 'repass': '', 'status': 'Pracownik' };

       //Sets editable object to variables of cliked one
       $scope.editUser = function(item) {

             $scope.worker.id = item.id;
             $scope.worker.name = item.name;
             $scope.worker.status = item.status;

       }

       //Actual updating function

       $scope.edit = function(item) {

         var i = $scope.users.length;

         $scope.invalidName = false;
         while (i--) { if($scope.worker.name == $scope.users[i].name && $scope.worker.id != $scope.users[i].id) $scope.invalidName = true; }

         if($scope.invalidName == true) alertBox("Błąd", "Taki uzytkownik juz istnieje", "danger");
         else if($scope.worker.pass != $scope.worker.repass && $scope.worker.pass != "")  alertBox("Błąd", "Hasła nie są takie same!", "danger");
         else if($scope.worker.pass.length < 6 && $scope.worker.pass != "")  alertBox("Błąd", "Hasło musi mieć przynajmniej 6 liter!", "danger");
         else {

           $http({
               method: 'POST',
                 url: $rootScope.APIurl+'user.api.php?get=editUser',
                   data:  item //edited object
                 }).then(function successCallback(response) {


                   if(response.data == "success") { //if everything's ok

                          alertBox('Sukces!','Uzytkownik został pozytywnie zmodyfikowany!','success');
                          $scope.getUsers(); //load records again

                   } else  alertBox('Błąd!','Coś poszło nie tak!','danger');


                 });

         }
       }

         /* END OF editing function*/



});
