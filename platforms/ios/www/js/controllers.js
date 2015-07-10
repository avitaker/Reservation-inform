angular.module('app.controllers', [])

.controller('selectModeCtrl', function($scope,$state){
  function pageListObj(title,titleUrl){
    this.title=title;
    this.titleUrl=titleUrl;
  }
  $scope.pageList=[
    new pageListObj('New Entry','newEntry'),
    new pageListObj('Update Reservation','updateReservation'),
    new pageListObj('Follow Up','followUp')
  ];
  $scope.navigateHere=function(thisPage){
    $state.go(thisPage);
  }
  $scope.thisIsChecked=0;
  $scope.setPage=function(page){
    $state.transitionTo(page);
  }
})

.controller('newEntryCtrl',function($scope,newResFact,$cordovaSms,$ionicPlatform,$cordovaToast,$ionicPopup,$ionicPopover,$cordovaDatePicker){
  $scope.person={};
  $scope.timed={};
  $ionicPopover.fromTemplateUrl('templates/reservationPopover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  var options = {
    date: new Date(),
    mode: 'time', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };

  // $scope.openTimePicker=function(){
  //   $cordovaDatePicker.show(options).then(function(date){
  //       alert(date);
  //   });
  // }

  $ionicPlatform.ready( function () {

    $cordovaDatePicker.show(options).then(function(date){
        alert(date);
    });

  }, false);

  $scope.buttonOnclick=function(){
    var myPopup=$ionicPopup.show({
      template:'<div display=inline-block><ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner><p align=center> Please Wait </p></div>',
      title:'Sending Message'
    });
    first=$scope.person.first;
    last=$scope.person.last;
    tele=$scope.person.tele;
    email=$scope.person.email;
    timed=$scope.person.timed;
    $scope.currentObj=newResFact.makeNewPerson(first,last,tele,email,timed);
    newResFact.addToList($scope.currentObj);
    var smsContent='Hello, ' + first + ' ' + last + '. We are preparing your reservation, and will send you an SMS when it is ready';
    $ionicPlatform.ready(function () {
      $cordovaSms
        .send(tele, smsContent)
        .then(function() {
          // $scope.person={};
          myPopup.close();
          $cordovaToast.showLongBottom('Message sent! Customer is waiting.').then(function(success) {
          }, function (error) {
            // error
          });
        }, function(error) {
          alert ("An error occured while sending the message. Please try again.");
        });
      }
    );
  }
})

.controller('updateReservationCtrl',function($scope,newResFact,resArchive,$cordovaSms,$ionicPlatform,$cordovaToast,$ionicPopup){
  $scope.currentList={};
  $scope.currentList.list=newResFact.personList;
  $scope.delete=function($index){
    if ($scope.currentList.list[$index].ready){
      var myPopup=$ionicPopup.show({
        template:'<div display=inline-block><ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner><p align=center> Please Wait </p></div>',
        title:'Sending Message'
      });
      var first=$scope.currentList.list[$index].firstName;
      var last=$scope.currentList.list[$index].lastName;
      var tele=$scope.currentList.list[$index].telephone;
      var smsContent='Hello again, ' + first + ' ' + last + '. Your reservation is now ready. Thank you for your patience.';
      $ionicPlatform.ready(function () {
        $cordovaSms
          .send(tele, smsContent)
          .then(function() {
            myPopup.close();
            resArchive.personList.push($scope.currentList.list[$index]);
            newResFact.personList.splice($index,1);
            $cordovaToast.showLongBottom('Message sent! Customer will arrive soon.').then(function(success) {
            }, function (error) {
              // error
            });
          }, function(error) {
            alert ("An error occured while sending the message. Please try again.");
          });
        }
      )
    }
  }
})

.controller("followUpCtrl",function($scope,resArchive){
  $scope.archiveList={};
  $scope.archiveList.list=resArchive.personList;
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
