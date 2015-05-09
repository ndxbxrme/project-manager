'use strict';

angular.module('pApp', [
  'ngCookies',
  'ngAnimate',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'foundation',
  'ngFileUpload',
  'ui.select2',
  'ngTagsInput',
  'pikaday',
  'ui.sortable',
  'angular-medium-editor'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token') && config.url.indexOf('api.cloudinary.com')===-1) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, dataModel, User, $window, navbar) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      navbar.clearProject();
      Auth.isLoggedInAsync(function(loggedIn) {
        if(loggedIn&&next.url!=='/login') {
          User.status({id:Auth.getCurrentUser()._id}, {online:true, currentPage:next.url});
        }
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
    $window.addEventListener('beforeunload', function() {
      dataModel.unsyncData();
      User.status({id:Auth.getCurrentUser()._id}, {online:false, currentPage:''});
    }, false);
  });