angular.module('FreshtexRM').controller('rekordyController',function($scope, $rootScope, $http, $routeParams) {

  $scope.header = (angular.isDefined($routeParams.type)) ? $routeParams.type : ''; //if we send 'header' by route param we can use it to display on page, if not define is at empty

  if(angular.isDefined($routeParams.type)) $scope.type = ($routeParams.type == 'Baza' || $routeParams.type == "") ?  '' :  $routeParams.type; //We only define two types Testy or Produkcja
  $scope.search = false; //it's not considered a search records screen by default

   /* Main ajax functions - get records */

   $scope.getRecords = function() {

      if(angular.isDefined($routeParams.query)) { //if it's search route

         $scope.search = $routeParams.query; //get query from route params

          $http({ method: 'GET', url: $rootScope.APIurl+'rekord.api.php?get=search&query=' + $routeParams.query
          }).then(function successCallback(response) {

            $scope.records = response.data; //load records from database to an array

          });

     }  else { //load records normally

          $http({ method: 'GET', url: $rootScope.APIurl+'rekord.api.php?get=all&type=' + $scope.type
          }).then(function successCallback(response) {

              $scope.records = response.data; //load records from database to an array

          });

        }

     }

   //Ajax request for getting list of companies
   $http({
       method: 'GET',
       url: $rootScope.APIurl+'rekord.api.php?get=firmy'
        }).then(function successCallback(response) {

            $scope.firmy = response.data;

         });


   //Ajax request for getting list of users
   $http({
       method: 'GET',
       url: $rootScope.APIurl+'user.api.php?get=all'
        }).then(function successCallback(response) {

            $scope.users = response.data;

         });

   /* END OF Ajax Function */

   $scope.getRecords(); //load records on start if it's not search screen


   /* Sorting records */

   //I'm setting default values for sorting

   $scope.orderRecords = '$index'; //order by $index, which bassically left things sorted by server-side (so it's by date)
   $scope.orderRecordsReverse = false; //order in the normal manner

   $scope.setRecordsOrder = function(orderBy) {

      if($scope.orderRecords == orderBy) $scope.orderRecordsReverse = ($scope.orderRecordsReverse) ? false : true; //if you click ordering by the same value second time, it makes ordering reversed
      $scope.orderRecords = orderBy; //set order by for given value

   }

   /* END OF sorting records */

   /* Removing records */

   $scope.recordToDelete; // variable that holds info about item we want to delete (eg. id)

   //This function sets recordToDelete variable by getting data from ng-repeat
   $scope.setToDel = function(item) {

          $scope.recordToDelete = item;

   }

   //actual removing function
   $scope.deleteRekord = function(item) {

     //ajax request to back-end
     $http({
         method: 'GET',
           url: $rootScope.APIurl+'rekord.api.php?get=deleteRekord&id='+item.id,
           }).then(function successCallback(response) {

                 $scope.getRecords(); //on success load records again
                 if($scope.rekordToShow != '') $scope.loadOthers(); //refreshing records in more info modal
                 alertBox('Sukces!','Rekord został usunięty!','success');

           });

     }

     /* END OF removing records*/

     /* More info about record modal */

     //Set empty object. We will fill it later with actual chosen object properties
     $scope.rekordToShow = {'id': '', 'firma': '', 'zlecenie': '','artykul': '','kolor': '','liczba_sztu': '','uwagi': '', 'by': '', 'zaladunek': '', 'otherRecords': '', 'loading': true}; //loading: true is used by ng-show "loading status" div

     //get others records that fit the order eg when you have 1/3 it's for loading another 2 objects from db
     $scope.loadOthers = function() {

      $http({
          method: 'GET',
            url: $rootScope.APIurl+'rekord.api.php?get=otherRekords&id='+$scope.rekordToShow.id+"&zlecenie="+$scope.rekordToShow.zlecenie,
            }).then(function successCallback(response) {

                $scope.rekordToShow.otherRecords = (response.data[0]) ? response.data : ''; //if there are no records set it to '', this way empty table won't be seen in the modal
                $scope.rekordToShow.loading = false; //turns off the loading msg

       });
      }

      //Sets rekordToshow object
      $scope.setToShow = function(item) {

          $scope.rekordToShow = item; //fill rekordToShow with parameters of cliked record
          $scope.rekordToShow.loading = true; //set loading msg
          $scope.rekordToShow.otherRecords = ''; //empty otherRecords variable

          if(item.zaladunek.liczba > 1) { //if there are more than 1/1 load others records info to show in the modal

              $scope.loadOthers();

          } else $scope.rekordToShow.loading = false; //if there's no to make an ajax request, set loading screen to false and return information

      }

      /* END OF Show more modal


      /* Edit records */

      //Set empty object
      $scope.rec = {'id': '', 'firma': '', 'zlecenie': '','artykul': '','kolor': '','liczba_sztu': '','uwagi': '', 'by': '', 'zaladunek': '', 'rodzaj': ''}

      //Sets editable object to variables of cliked one
      $scope.editRecord = function(item) {

            $scope.rec.id = item.id;
            $scope.rec.rodzaj = item.rodzaj;
            $scope.rec.firma = item.firma;
            $scope.rec.zlecenie = item.zlecenie
            $scope.rec.artykul = item.artykul
            $scope.rec.kolor = item.kolor;
            $scope.rec.liczba_sztuk = item.liczba_sztuk;
            $scope.rec.zaladunek = { 'nr': item.zaladunek.nr, 'liczba': item.zaladunek.liczba };
            $scope.rec.by = item.by;
            $scope.rec.uwagi = item.uwagi;

      }

      //Actual updating function

      $scope.edit = function(item) {


          $http({
              method: 'POST',
                url: $rootScope.APIurl+'rekord.api.php?get=editRekord',
                  data:  item //edited object
                }).then(function successCallback(response) {

                  $("#loading").fadeOut('slow'); //hide loading msg

                  if(response.data == "success") { //if everything's ok

                         alertBox('Sukces!','Rekord został pozytywnie zmodyfikowany!','success');
                         $scope.getRecords(); //load records again

                  } else  alertBox('Błąd!','Coś poszło nie tak!','danger');


                });

        }

        /* END OF editing function*/

        /* CHANGE record type */

        $scope.changeRecordType = function(item, typed) {

          if(item.type == typed) typed = ""; //if we want to set type that is already set, the system will switch it off instead

          $http({
              method: 'GET',
                url: $rootScope.APIurl+'rekord.api.php?get=changeRecordType&id='+item.id+'&type='+typed,
                }).then(function successCallback(response) {

                      $scope.getRecords(); //refresh records
                      if($scope.rekordToShow != '') $scope.loadOthers(); //refreshing records in more info modal

                });

        }

      /* END OF changing record type*/

      /* Adding record */

      $scope.rekord = { 'rodzaj': '', 'by': ''}; // This value has to be defined
      $scope.addRekord = function() {


        if(angular.isDefined($scope.type) && angular.isDefined($scope.rekord.rodzaj)) $scope.rekord.rodzaj = $scope.type;
        if(angular.isDefined($scope.rekord.rodzaj) && $scope.rekord.rodzaj == '') $scope.rekord.rodzaj = "Produkcja";

        $http({
            method: 'POST',
              url: $rootScope.APIurl+'rekord.api.php?get=addRekord',
                data:  $scope.rekord //new object
              }).then(function successCallback(response) {

           if(response.data == "success") {  //if success

            alertBox('Sukces!','Rekord został dodany!','success');

              //Let's clear all variables

              $scope.rekord.rodzaj = "";
              $scope.rekord.firma = "";
              $scope.rekord.zlecenie = "";
              $scope.rekord.artykul = "";
              $scope.rekord.kolor = "";
              $scope.rekord.zaladunek.nr = "";
              $scope.rekord.zaladunek.liczba = "";
              $scope.rekord.liczba_sztuk = "";
              $scope.rekord.by = "";


              $scope.getRecords(); //refresh records

       }
       else {
             alertBox("Błąd", "Coś poszło nie tak...", "danger");
       }

      }, function errorCallback(response) {

          alertBox("Błąd", "Coś poszło nie tak...", "danger");

      });

     }

     /* END of adding records */




});
