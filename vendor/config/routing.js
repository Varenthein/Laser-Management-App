angular.module('FreshtexRM').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false);

  $routeProvider
        .when('/index/', {
            controller: 'announcementsController',
            templateUrl: 'views/index.view',
        })
        .when('/login/', {
            controller: 'loginController',
            templateUrl: 'views/login.view',
        })
        .when('/dodaj/', {
            controller: 'addRekordController',
            templateUrl: 'views/dodaj.view',
        })
        .when('/rekordy/:type', {
            controller: 'rekordyController',
            templateUrl: 'views/rekordy.view'
        })
        .when('/rekordy/:type/:query', {
            controller: 'rekordyController',
            templateUrl: 'views/rekordy.view'
        })
        .when('/users/', {
            controller: 'userController',
            templateUrl: 'views/users.view'
        })
        .when('/301/', {
            templateUrl: 'views/errors/301.view',
        })
        .when('/404/', {
            templateUrl: 'views/errors/404.view',
        })
        .otherwise({
            redirectTo: '/404/'
        });

});

//Route to home at app start

window.location = "#/index/";
