// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'app.controllers', 'starter.services','ngCordova','ngStorage'])

.run(function($ionicPlatform,$cordovaStatusbar) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      $cordovaStatusbar.overlaysWebView(true);
      //$cordovaStatusBar.style(1);
      // $cordovaStatusbar.styleColor('DarkstGreen');
      $cordovaStatusbar.styleHex('#2db955');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('selectMode',{
      url:"/",
      templateUrl:"templates/selectModeTMPL.html",
      controller:'selectModeCtrl'
    })
    .state('newEntry',{
      url:'/newEntry',
      templateUrl:"templates/newEntryTMPL.html",
      controller:'newEntryCtrl'
    })
    .state('updateReservation',{
      url:'/updateReservation',
      templateUrl:"templates/updateReservationTMPL.html",
      controller:'updateReservationCtrl'
    })
    .state('editReservation',{
      url:'/editReservation',
      templateUrl:'templates/editReservationHTML.html',
      controller:'editReservationCtrl'
    })
    .state('followUp',{
      url:'/followUp',
      templateUrl:"templates/followUpTMPL.html",
      controller:"followUpCtrl"
    }).state('newOldRes',{
      url:'/newOldRes',
      templateUrl:"templates/newOldResTMPL.html",
      controller:"newOldResCtrl"
    }).state('settings',{
      url:'/settings',
      templateUrl:'templates/settingsTMPL.html',
      controller:'settingsCtrl'
    }).state('settingsResults',{
      url:'/settingsResults',
      templateUrl:'templates/settingsResultsTMPL.html',
      controller:'settingsResultsCtrl'
    }).state('editCust',{
      url:'/editCust',
      templateUrl:'templates/editCustTMPL.html',
      controller:'editCustCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});
