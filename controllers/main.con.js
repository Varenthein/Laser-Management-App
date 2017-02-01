angular.module('FreshtexRM').controller('MainController',function($scope, $rootScope) {

  //set menu items
  this.Menu = [
    { title: 'Index', link: '#/index' },
    { title: 'Baza', link: '#/rekordy/Baza' },
    { title: 'Testy', link: '#/rekordy/Testy' },
    { title: 'Produkcja', link: '#/rekordy/Produkcja' },
   ];

   //set defualt route active
   this.Menu[0].status = "active";

});
