angular.module('FreshtexRM').controller('announcementsController',function($scope, $rootScope, $http) {

            $scope.classes = [{ 'name': 'Normalny', 'style': 'primary' }, { 'name': 'Wazny', 'style': 'warning' }, { 'name': 'Bardzo wazny', 'style': 'danger' }]; // set types of annoucements
            $scope.recordToDelete; // variable to store record to delete information

            /* Load annoucemens from database function */
            $scope.loadAnno = function() {

              $http({
                  method: 'GET',
                  url: $rootScope.APIurl+'anno.api.php?get=all' //get all annoucements
              }).then(function successCallback(response) { //if success

                    $scope.announcements = response.data; //load data to object annoucements

              });

            }

            /* END OF annoucements load from db function*/

            $scope.loadAnno(); //load annoucements on start

            /* ADD ANNOUCEMENT function */
            $scope.addAnno = function() {

                $scope.wpis.author_status = $rootScope.user.status; //set author status from logged user info
                $scope.wpis.author = $rootScope.user.name; //set author name the same as logged user

                //post request to api
                $http({
                  method: 'POST',
                  url: $rootScope.APIurl+'anno.api.php?get=addWpis',
                  data:  $scope.wpis //actual data
                 }).then(function successCallback(response) {

                   if(response.data == "success") { //if success

                        alertBox('Sukces!','Wpis został dodany!','success');

                        //clear inputs
                        $scope.wpis.author = "";
                        $scope.wpis.title = "";
                        $scope.wpis.content= "";

                        $scope.loadAnno(); //refresh annoucements

                   }
                   else alertBox('Błąd!','Coś poszło nie tak!','danger');  //if something went wrong dispaly box

                  });


            }

            /*END OF adding function */

            /* DELETE ANNO FUNCTION */
            $scope.setToDel = function(item) {

                $scope.recordToDelete = item; //store record to delete info in new variable

            }

            //actual delete record function
            $scope.deleteAnno = function(item) {

              //connect to api and delete anno with item.id
              $http({
                  method: 'GET',
                    url: $rootScope.APIurl+'anno.api.php?get=deleteAnno&id='+item.id,
                    }).then(function successCallback(response) {

                          $scope.loadAnno(); //refresh annoucements

                    });

            }

            //END OF annoucements function

});
