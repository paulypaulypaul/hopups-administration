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
    'adminAppConfig'
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
    });

  })
  .run(['$rootScope', '$injector', '$state', function($rootScope,$injector, $state) {
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

      }]);
