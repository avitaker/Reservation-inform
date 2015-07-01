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

.controller('newEntryCtrl',function($scope,newResFact){
  $scope.person={};
  $scope.buttonOnclick=function(){
    first=$scope.person.first;
    last=$scope.person.last;
    tele=$scope.person.tele;
    $scope.currentObj=newResFact.makeNewPerson(first,last,tele);
    newResFact.addToList($scope.currentObj);
    alert('Done!');
    $scope.person={};
  }
})

.controller('updateReservationCtrl',function($scope,newResFact){
  $scope.currentList={};
  $scope.currentList.list=newResFact.personList;
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
