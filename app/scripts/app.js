'use strict';

/**
 * @ngdoc overview
 * @name adminApp
 * @description
 * # adminApp
 *
 * Main module of the application.
 */
angular
  .module('adminApp', [
    'ngMaterial',
    'ngAnimate',
    'ngCookies',
    'ngResource',
	  'ui.router',
    'ngSanitize',
    'afOAuth2',
    'adminAppConfig',
    'ui.ace',
    'googlechart',
    'angular-tour'
  ])
  .run(function($rootScope){
    $rootScope.theme = 'default';
    $rootScope.title = 'HopUps';
  })
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login', {
      templateUrl:'views/login.html',
      url:'/login'
    })
    .state('sites', {
      templateUrl: 'views/sites.html',
      controller: 'SitesCtrl',
      controllerAs: 'vm',
      url: '/sites'
    })
    .state('site', {
      templateUrl: 'views/site.html',
      controller: 'SiteCtrl',
      controllerAs: 'vm',
      url: '/site/:siteId'
    })
    .state('site-analysis', {
      templateUrl: 'views/analyse.html',
      controller: 'AnalyseCtrl',
      controllerAs: 'vm',
      url: '/site-analysis/:siteId'
    })
    .state('user-analysis', {
      templateUrl: 'views/user.html',
      controller: 'UserCtrl',
      controllerAs: 'vm',
      url: '/user-analysis/:siteId'
    });;

  })
  .run(['$rootScope', '$injector', '$state', function($rootScope, $injector, $state) {
      $injector.get('$http').defaults.transformRequest = function(data, headersGetter) {
        if (sessionStorage.token) {
          var token = JSON.parse(sessionStorage.token);
          if (token && token.access_token){
            headersGetter().Authorization = 'Bearer ' + token.access_token;
          }
        }
        if (data) {
          return angular.toJson(data);
        }
      };

      $rootScope.$on('$stateChangeStart', function(event, toState){
        if (!sessionStorage.token && toState.name !== 'login' || sessionStorage.token === 'null' && toState.name !== 'login') {
          event.preventDefault();
          $state.go('login');
        } else if (sessionStorage.token && sessionStorage.token !== 'null' && toState.name === 'login') {
          event.preventDefault();
          $state.go('sites');
        }
      });

    }])
    .config(function($mdThemingProvider, $mdIconProvider){

      $mdIconProvider
          .defaultIconSet(      "svg/avatars.svg"      , 128)
          .icon("plus"        , "svg/plus.svg"         , 24)
          .icon("menu"        , "svg/menu.svg"         , 24)
          .icon("facebook-box", "svg/facebook-box.svg" , 24)
          .icon("home"        , "svg/home.svg"         , 24)
          .icon("chart"       , "svg/chart.svg"        , 24)
          .icon("login"       , "svg/login.svg"        , 24)
          .icon("logout"      , "svg/logout.svg"       , 24)
          .icon("transfer"    , "svg/transfer.svg"     , 24)
          .icon("delete"      , "svg/delete.svg"       , 24)
          .icon("build"       , "svg/build.svg"        , 24)
          .icon("lock"        , "svg/lock.svg"         , 24)
          .icon("face"        , "svg/face.svg"         , 24)
          ;

      $mdThemingProvider.theme('hopups')
        .accentPalette('pink')
        .primaryPalette('blue');

      $mdThemingProvider.theme('hopups-dashboard')
      .accentPalette('blue')
      .primaryPalette('pink');

      $mdThemingProvider.alwaysWatchTheme(true);
  });
