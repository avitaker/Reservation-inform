angular.module('starter.services', [])
.factory('newResFact',function($timeout,$cordovaSms,$cordovaToast,$ionicPopup,$localStorage,$filter){
  if (!$localStorage.currPersonList){
    $localStorage.currPersonList=[];
    $localStorage.archPersonList=[];
  }
  var factory={};
  function newPerson(firstName,lastName,numSeats,telephone){
    this.firstName=firstName;
    this.lastName=lastName;
    this.numSeats=numSeats;
    this.telephone=telephone;
    this.currStatus = "Waiting now";
  }
  factory.makeNewPerson=function(fir,las,numSeats,tel){
    var newOne=new newPerson(fir,las,numSeats,tel);
    return newOne;
  }

  factory.reminderInt = 10000;
  factory.statusArr = [];

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
    somthing.alPop=$ionicPopup.alert({
       title: 'Reservation time!',
       template: somthing.firstName + ' ' + somthing.lastName + ' has a reservation at this time'
     });
     somthing.alPop.then(function(res) {
       somthing.alPop.close();
       $timeout.cancel(somthing.timeOut);
       somthing.timeOut=undefined;
       somthing.timeLeft=0;
       somthing.currStatus = "OVERDUE!";
      //  factory.remTimeOut(somthing);
     });
  }

  factory.runTimeOut=function(samething){
      samething.timeOut=$timeout(
        function(){
          factory.doAlert(samething)
        },
        samething.timeLeft
      );
  }

  factory.timedReservation=function(something){
    var first=something.firstName;
    var last=something.lastName;
    var tele=something.telephone;
    var nowDate=new Date();
    factory.getTheDateRight(something.timed);
    // console.log(something.timed);
    // var smsContent='Hello, ' + first + ' ' + last + '. Your reservation is ready.';
    something.timeLeft=something.timed.getTime()-nowDate.getTime();
    // console.log(something.timeLeft);
    // factory.timeLeft=timeLeft;
    factory.runTimeOut(something);
  }

  factory.addToList=function(soomething){
    $localStorage.currPersonList.push(soomething);
    if (soomething.timed){
      factory.timedReservation($localStorage.currPersonList[$localStorage.currPersonList.length-1]);
      factory.getTheDateRight($localStorage.currPersonList[$localStorage.currPersonList.length-1].timed);
      $localStorage.currPersonList[$localStorage.currPersonList.length-1].currStatus = 'Due at ' + $filter('date')($localStorage.currPersonList[$localStorage.currPersonList.length-1].timed,'shortTime');
    }
  }

  factory.doReminder=function(somthing){
    somthing.remPop=$ionicPopup.alert({
       title: 'Please resolve reservation',
       template: somthing.firstName + ' ' + somthing.lastName + ' has an unresolved reservation. Please resolve in the "Update Reservaton" page.'
     });
     somthing.alPop.then(function(res) {
       somthing.remPop.close();
       $timeout.cancel(somthing.reminder);
       somthing.reminder=undefined;
       factory.remTimeOut(somthing);
     });
  }

  factory.remTimeOut=function(samething){
      samething.reminder=$timeout(
        function(){
          factory.doReminder(samething)
        },
        factory.reminderInt
      );
  }

  factory.checkTimedStatus = function(){
    factory.statusArr = [];
    var dateNow = new Date();
    for (var i=0;i<$localStorage.currPersonList.length;i++){
      if (!$localStorage.currPersonList[i].timed){
        factory.statusArr.push('Waiting now');
      }
      else {
        factory.getTheDateRight($localStorage.currPersonList[i].timed);
        if ($localStorage.currPersonList[i].timed.getTime() > dateNow.getTime()){
          factory.statusArr.push('Overdue');
        }
        else if ($localStorage.currPersonList[i].timed.getTime() < dateNow.getTime()) {
          factory.statusArr.push('Upcoming');
        }
      }
    }
    return factory.statusArr;
  }

  return factory;
})

.factory ('editFact',function(){
  var factory={};
  factory.oldObject={};
  factory.thisOne=0;
  factory.newOldInd = 0;
  factory.loadHerUp = function(objectHere){
    var returnObj = objectHere;
    returnObj.numSeats = undefined;
    returnObj.timed = undefined;
    return returnObj;
  }
  factory.newObject={};
  return factory;
})

.factory('resArchive',function($localStorage){
  var factory={};
  factory.personList=$localStorage.archPersonList || [];
  factory.readyList=[];
  factory.cancelList=[];
  factory.makeReady = function(arr){
    var returnArr = [];
    for (var i=0;i<arr.length;i++){
      if (arr[i].ready){
        arr[i].readyShow = false;
        returnArr.push(arr[i]);
      }
      else {continue;}
    }
    return returnArr;
  }
  factory.makeCancel = function(arr){
    var returnArr = [];
    for (var i=0;i<arr.length;i++){
      if (arr[i].cancelled){
        arr[i].cancelShow = false;
        returnArr.push(arr[i]);
      }
      else {continue;}
    }
    return returnArr;
  }
  return factory;
})

.factory('settingsFact',function($localStorage){
  var factory = {};

  factory.searchObject = {};
  factory.isSearch = false;
  factory.isChronological = false;
  factory.returnArray = [];
  factory.resultIndices = [];

  factory.loadChronological = function(){
    var returnArr = [];
    var resultIndices = [];
    for (var i=0;i<$localStorage.archPersonList.length;i++){
      returnArr.push($localStorage.archPersonList[i]);
      resultIndices.push(i);
    }
    factory.returnArray = returnArr;
    factory.resultIndices = resultIndices;
    // return [returnArr,resultIndices];
  }

  factory.searchThis = function(searchObj){
    var returnArr = [];
    var resultIndices = [];
    if (searchObj.firstName && searchObj.firstName.length>0){
      if (!searchObj.lastName && !searchObj.telephone){
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].firstName.toLowerCase() == searchObj.firstName.toLowerCase()){
            returnArr.push($localStorage.archPersonList[l]);
            resultIndices.push(l);
          }
        }
      }
      else if (searchObj.lastName && !searchObj.telephone) {
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].firstName.toLowerCase() == searchObj.firstName.toLowerCase() && $localStorage.archPersonList[l].lastName.toLowerCase() == searchObj.lastName.toLowerCase()){
            returnArr.push($localStorage.archPersonList[l]);
            resultIndices.push(l);
          }
        }
      }
      else if (!searchObj.lastName && searchObj.telephone){
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].telephone == searchObj.telephone && $localStorage.archPersonList[l].firstName.toLowerCase() == searchObj.firstName.toLowerCase()){
            returnArr.push($localStorage.archPersonList[l]);
            resultIndices.push(l);
          }
        }
      }
      else if (searchObj.lastName && searchObj.telephone){
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].firstName.toLowerCase() == searchObj.firstName.toLowerCase() && $localStorage.archPersonList[l].lastName.toLowerCase() == searchObj.lastName.toLowerCase() && $localStorage.archPersonList[l].telephone == searchObj.telephone){
            returnArr.push($localStorage.archPersonList[l]);
            resultIndices.push(l);
          }
        }
      }
    }
    else if (searchObj.lastName && !searchObj.firstName){
      if (!searchObj.telephone){
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].lastName.toLowerCase() == searchObj.lastName.toLowerCase()){
            returnArr.push($localStorage.archPersonList[l]);
            resultIndices.push(l);
          }
        }
      }
      else {
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].lastName.toLowerCase() == searchObj.lastName.toLowerCase() && $localStorage.archPersonList[l].telephone == searchObj.telephone){
            returnArr.push($localStorage.archPersonList[l]);
            resultIndices.push(l);
          }
        }
      }
    }
    else if (searchObj.telephone && !searchObj.lastName && !searchObj.firstName){
      for (var l=0;l<$localStorage.archPersonList.length;l++){
        if ($localStorage.archPersonList[l].telephone == searchObj.telephone){
          returnArr.push($localStorage.archPersonList[l]);
          resultIndices.push(l);
        }
      }
    }
    factory.returnArray = returnArr;
    factory.resultIndices = resultIndices;
    // return [resultArr,resultIndices];
  }

  factory.deleteAll = function(){
    $localStorage.archPersonList = [];
  }

  return factory;
})
//
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
;
