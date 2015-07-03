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

.controller('newEntryCtrl',function($scope,newResFact,$cordovaSms,$ionicPlatform,$cordovaSpinnerDialog,$cordovaToast){
  $scope.person={};
  $scope.buttonOnclick=function(){
    $cordovaSpinnerDialog.show("Sending Message","Please wait", true);
    first=$scope.person.first;
    last=$scope.person.last;
    tele=$scope.person.tele;
    $scope.currentObj=newResFact.makeNewPerson(first,last,tele);
    newResFact.addToList($scope.currentObj);
    var smsContent='Hello, ' + first + ' ' + last + '. We are preparing your reservation, and will send you an SMS when it is ready';
    $ionicPlatform.ready(function () {
      $cordovaSms
        .send(tele, smsContent)
        .then(function() {
          $scope.person={};
          //alert("Reservation is in the system, and customer should recieve an SMS notification soon.");
          $cordovaSpinnerDialog.hide();
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

.controller('updateReservationCtrl',function($scope,newResFact,resArchive,$cordovaSms,$ionicPlatform,$cordovaSpinnerDialog,$cordovaToast){
  $scope.currentList={};
  $scope.currentList.list=newResFact.personList;
  $scope.delete=function($index){
    if ($scope.currentList.list[$index].ready){
      $cordovaSpinnerDialog.show("Sending Message","Please wait", true);
      var first=$scope.currentList.list[$index].firstName;
      var last=$scope.currentList.list[$index].lastName;
      var tele=$scope.currentList.list[$index].telephone;
      var smsContent='Hello again, ' + first + ' ' + last + '. Your reservation is now ready. Thank you for your patience.';
      $ionicPlatform.ready(function () {
        $cordovaSms
          .send(tele, smsContent)
          .then(function() {
            $cordovaSpinnerDialog.hide();
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
  $scope.archiveList=resArchive.personList;
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
