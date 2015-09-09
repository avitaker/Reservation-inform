angular.module('starter.services', [])
.factory('newResFact',function($timeout,$cordovaSms,$cordovaToast,$ionicPopup){
  var factory={};
  function newPerson(firstName,lastName,numSeats,telephone,email,timed){
    this.firstName=firstName;
    this.lastName=lastName;
    this.numSeats=numSeats;
    this.telephone=telephone;
    this.email=email;
    this.timed=timed;
  }
  factory.personList=[];
  factory.makeNewPerson=function(fir,las,numSeats,tel,email,timed){
    var newOne=new newPerson(fir,las,tel,email,timed);
    return newOne;
  }
  factory.getTheDateRight=function(aDate){
    var nowDate=new Date();
    var realDate=nowDate.getDate();
    var realMonth=nowDate.getMonth();
    var realYear=nowDate.getFullYear();
    aDate.setDate(realDate);
    aDate.setMonth(realMonth);
    aDate.setFullYear(realYear);
  }

  factory.doAlert=function(somthing){
    console.log('doAlert try');
    somthing.alPop=$ionicPopup.alert({
       title: 'Reservation time!',
       template: somthing.firstName + ' ' + somthing.lastName + ' has a reservation at this time'
     });
     alertPopup.then(function(res) {
       somthing.alPop.close();
       $timeout.cancel(somthing.timeOut);
       somthing.timeOut=undefined;
       somthing.timeLeft=0;
       console.log('Please work');
     });
    // var toast="The following reservation is overdue: " + somthing.firstName + " " + somthing.lastName;
    // $cordovaToast.showLongBottom(toast).then(function(success) {
    //   console.log('doAlert succeed');
    //   $timeout.cancel(somthing.timeOut);
    //   somthing.timeOut=undefined;
    //   somthing.timeLeft=0;
    // }, function (error) {
    //   factory.doAlert(somthing)
    // });
  }

  factory.runTimeOut=function(samething){
    // if ($scope.isQuizActive===true){
    console.log('runTimeOut');
      samething.timeOut=$timeout(
        function(){
          factory.doAlert(samething)
        },
        samething.timeLeft
      );
    // }
    // else {$timeout.cancel($scope.timeLimit);}
  }

  factory.addToList=function(something){
    factory.personList.push(something);
    if (something.timed){
      console.log(something.timed);
      var first=something.firstName;
      var last=something.lastName;
      var tele=something.telephone;
      var nowDate=new Date();
      factory.getTheDateRight(something.timed);
      console.log(something.timed);
      var smsContent='Hello, ' + first + ' ' + last + '. Your reservation is ready.';
      something.timeLeft=something.timed.getTime()-nowDate.getTime();
      console.log(something.timeLeft);
      // factory.timeLeft=timeLeft;
      factory.runTimeOut(something);
      // function timeOutFunction(){
      //   $cordovaSms
      //     .send(tele, smsContent)
      //     .then(function() {
      //       $cordovaToast.showLongBottom('Message sent! Customer is waiting.').then(function(success) {
      //       }, function (error) {
      //         // error
      //       });
      //     }, function(error) {
      //       alert ("An error occured while sending the message. Please try again.");
      //       $timeout(timeOutFunction,timeLeft);
      //     });
      // }
      // timeOutFunction();
    }
  }
  return factory;
})

.factory('resArchive',function(){
  var factory={};
  factory.personList=[];
  return factory;
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
