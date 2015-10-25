angular.module('app.controllers', [])

.controller('selectModeCtrl', function($scope,$state){
  function pageListObj(title,titleUrl){
    this.title=title;
    this.titleUrl=titleUrl;
  }
  $scope.pageList=[
    // new pageListObj('New Entry','newEntry'),
    new pageListObj('Make Reservation','followUp'),
    new pageListObj('Update Reservation','updateReservation'),
    new pageListObj('Manage Records and Batch Actions','settings')
  ];
  $scope.navigateHere=function($index){
    $state.go($scope.pageList[$index].titleUrl);
  }
})


.controller('newEntryCtrl',function($scope,newResFact,$cordovaSms,$ionicPlatform,$cordovaToast,$ionicPopup,$cordovaDatePicker,$ionicHistory,$filter,$localStorage,editFact){
  $scope.$storage=$localStorage;
  $scope.person={};
  $scope.timed={};
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

  $scope.openTimePicker=function(){
    $cordovaDatePicker.show(options).then(function(date){
        alert(date);
    });
  }

  $scope.buttonOnclick=function(){
    if (!$scope.person.tele){
      var thisPopup=$ionicPopup.alert({
        template:'<div class="item item-text-wrap">Please enter a valid phone number</div>',
        title:'Telephone number error',
      });
      alertPopup.then(function(res) {
        thisPopup.close();
      })
    }
    else if ($scope.person.tele.length!=10){
      var thisPopup=$ionicPopup.alert({
        template:'<div class="item item-text-wrap">Phone number appears to be too short</div>',
        title:'Telephone number error',
      });
      alertPopup.then(function(res) {
        thisPopup.close();

        // $timeout.cancel(somthing.timeOut);
        // somthing.timeOut=undefined;
        // somthing.timeLeft=0;
        // console.log('Please work');
      })
    }
    else {
      var myPopup=$ionicPopup.show({
        template:'<div display=inline-block><ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner><p align=center> Please Wait </p></div>',
        title:'Sending Message'
      });
      first=$scope.person.first;
      last=$scope.person.last;
      numSeats=$scope.person.numSeats || 1;
      tele=$scope.person.tele;
      timed=($scope.person.timed);
      $scope.currentObj=newResFact.makeNewPerson(first,last,numSeats,tele);
      var smsContent;
      if ($scope.person.timed){
        $scope.currentObj.timed=new Date(timed);
        smsContent='Hello, ' + first + ' ' + last + '. We are preparing your reservation for ' + numSeats + ' seats at ' + $filter("date")(timed, "shortTime") + ', and will send you an SMS when it is ready';
      }
      else {
        smsContent='Hello, ' + first + ' ' + last + '. We are preparing a table for ' + numSeats + ', and will send you an SMS when it is ready';
      }
      newResFact.addToList($scope.currentObj);
      // console.log(typeof $localStorage.currPersonList[$localStorage.currPersonList.length-1].timed);
      // console.log(smsContent);
      // console.log($localStorage.currPersonList[$localStorage.currPersonList.length-1].timed);
      // $ionicHistory.goBack();
        $ionicPlatform.ready(function () {
          $cordovaSms
            .send(tele, smsContent)
            .then(function() {
              // $scope.person={};
              // $localStorage.currPersonList[$localStorage.currPersonList.length-1].sentTexts = [smsContent];
              myPopup.close();
              $cordovaToast.showLongBottom('Message sent! Customer is waiting.').then(function(success) {
                $ionicHistory.goBack();
              }, function (error) {
                // error
              });
            }, function(error) {
              alert ("An error occured while sending the message. Please try again.");
            });
          }
        );
    }
  }
})

.controller('updateReservationCtrl',function($scope,$cordovaSms,$ionicPlatform,$cordovaToast,$ionicPopup,$localStorage,$state,editFact,newResFact,$timeout){
  $scope.$storage=$localStorage;
  $scope.noReservations = false;
  if ($localStorage.currPersonList.length==0){
    $scope.noReservations = true;
  }
  else {
    $scope.noReservations = false;
  }
  $scope.openEdit2=function($index){
    // console.log("index is " + $index);
    editFact.thisOne=$index;
    $scope.currentFirst=$scope.$storage.currPersonList[$index].firstName;
    $scope.currentLast=$scope.$storage.currPersonList[$index].lastName;
    $scope.numSeats=$scope.$storage.currPersonList[$index].numSeats;
    $scope.currentTele=$scope.$storage.currPersonList[$index].telephone;
    $scope.currentTime=$scope.$storage.currPersonList[$index].timed || undefined;
    editFact.oldObject = newResFact.makeNewPerson($scope.currentFirst,$scope.currentLast,$scope.numSeats,$scope.currentTele);
    if ($scope.currentTime){
      editFact.oldObject.timed=new Date($scope.currentTime);
    }
    $state.go('editReservation');
  }

  $scope.delete=function($index){
    if ($scope.$storage.currPersonList[$index].ready){
      // console.log($scope.$storage.currPersonList[$index].telephone);
      var myPopup=$ionicPopup.show({
        template:'<div display=inline-block><ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner><p align=center> Please Wait </p></div>',
        title:'Sending Message'
      });
      var first = $scope.$storage.currPersonList[$index].firstName;
      var last = $scope.$storage.currPersonList[$index].lastName;
      var tele = $scope.$storage.currPersonList[$index].telephone;
      var smsContent = 'Hello again, ' + first + ' ' + last + '. Your reservation is now ready. Thank you for your patience.';
      $scope.$storage.archPersonList.push($scope.$storage.currPersonList[$index]);
      $scope.$storage.currPersonList.splice($index,1);
      // myPopup.close();
      $ionicPlatform.ready(function () {
        $cordovaSms
          .send(tele, smsContent)
          .then(function() {
            // $scope.$storage.currPersonList[$index].sentTexts.push(smsContent)
            myPopup.close();
            $scope.$storage.archPersonList.push($scope.currentList.list[$index]);
            $scope.$storage.currPersonList.splice($index,1);
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
    else if ($scope.$storage.currPersonList[$index].cancelled){
      $scope.$storage.archPersonList.push($scope.$storage.currPersonList[$index]);
      $scope.$storage.currPersonList.splice($index,1);
    }
  }
})

.controller ("editReservationCtrl",function($scope,$localStorage,$ionicHistory,$filter,editFact,newResFact,$timeout){
  $scope.$storage = $localStorage;
  var refObj = $localStorage.currPersonList[editFact.thisOne];
  $scope.currentPerson = newResFact.makeNewPerson(refObj.firstName,refObj.lastName,refObj.numSeats,refObj.telephone);
  if (refObj.timed){
    $scope.currentPerson.timed = new Date(refObj.timed);
  }
  // console.log(editFact.oldObject);

  // console.log(typeof $scope.currentTime);
  // $scope.trackName=function($index){
  //   console.log($index);
  //   console.log($scope.currentList.list[$index].first);
  // }

  // $scope.teleChange = function(old,changed){
  //   console.log('new tele' + changed.telephone);
  //   console.log('old tele' + old.telephone);
  // }
  //
  // $scope.seatChange = function(old,changed){
  //   console.log('old seats' + old.numSeats);
  //   console.log('new seats' + changed.numSeats);
  // }
  //
  // $scope.timeChange = function(old,changed,$index){
  //   console.log('old time' + old.timed);
  //   console.log(typeof old.timed);
  //   console.log('new time' + changed.timed);
  //   console.log(typeof changed.timed);
  //
  // }

  $scope.teleChange = function(old,changed){
    var oldTele = old.telephone;
    var tele = changed.telephone;
    var oldSmsContent = "Hello, sir/madam. Our restaurant records have been modified, and this number is no longer associated with an active customer. If you believe this message to be in error, please contact us.";
    var smsContent = 'Hello, ' + changed.firstName + ' ' + changed.lastName + ', this message is to inform you that you have changed your associated telephone number in our records.';
    // console.log(smsContent);
    $ionicPlatform.ready(function () {
      $cordovaSms
        .send(tele, smsContent)
        .then(function() {
          $cordovaToast.showLongBottom('Message sent! Customer has been informed of modified telephone number').then(function(success) {
          }, function (error) {
            // error
          });
        }, function(error) {
          alert ("An error occured while sending the message. Please try again.");
        });
        $cordovaSms
          .send(oldTele, oldSmsContent)
          .then(function() {
            $cordovaToast.showLongBottom('Message sent! Previous number has been informed of telephone number removal.').then(function(success) {
            }, function (error) {
              // error
            });
          }, function(error) {
            alert ("An error occured while sending the message. Please try again.");
          });
      }
    )
  }

  $scope.seatChange = function(old,changed){
    var oldSeats = old.numSeats;
    var newSeats = changed.numSeats;
    var tele = changed.tele;
    var smsContent = 'Hello, ' + changed.firstName.toString() + ' ' + changed.lastName.toString() + '. This message is to inform you that your reservation is now for a table of ' + newSeats.toString() + '. Please contact us if this message is in error.';
    // console.log(smsContent);
    $ionicPlatform.ready(function () {
      $cordovaSms
        .send(tele, smsContent)
        .then(function() {
          $cordovaToast.showLongBottom('Message sent! Customer has been informed about new number of seats.').then(function(success) {
          }, function (error) {
            // error
          });
        }, function(error) {
          alert ("An error occured while sending the message. Please try again.");
        });
      }
    )
  }

  $scope.timeChange = function(old,changed){
    var oldTime = old.timed;
    var newTime = changed.timed;
    var tele = changed.telephone;
    var smsContent = 'Hello, ' + changed.firstName + ' ' + changed.lastName + ', this message is to inform you that your reservation has been moved to ' + $filter("date")(newTime, "shortTime") + '. Please contact us if this message is in error.';
    // console.log(smsContent);
    $ionicPlatform.ready(function () {
      $cordovaSms
        .send(tele, smsContent)
        .then(function() {
          $cordovaToast.showLongBottom('Message sent! Customer has been informed about new reservation time.').then(function(success) {
          }, function (error) {
            // error
          });
        }, function(error) {
          alert ("An error occured while sending the message. Please try again.");
        });
      }
    )
    newResFact.timedReservation(changed);
  }

  $scope.processChanges = function(old,changed){
    if (old.timed.getTime() != changed.timed.getTime()){
      if (old.telephone != changed.telephone){
        $scope.teleChange(old,changed);
      }
      else if (old.numSeats != changed.numSeats){
        if (old.telephone != changed.telephone){
          $scope.teleChange(old,changed);
        }
        $scope.seatChange(old,changed);
      }
      $scope.timeChange(old,changed);
    }
    else if (old.numSeats != changed.numSeats){
      if (old.telephone != changed.telephone){
        $scope.teleChange(old,changed);
      }
      $scope.seatChange(old,changed);
    }
    else if (old.telephone != changed.telephone){
      $scope.teleChange(old,changed);
    }
    else {
      // console.log('nothing changed');
    }
  }

  $scope.cleanTimeout = function(obj){
    if (obj.timeOut){
      $timeout.cancel(obj.timeOut);
      obj.timeOut=undefined;
    }
  }

  $scope.submitEdit=function() {
    $scope.thisOne = editFact.thisOne;
    // console.log('editing this: ' + $scope.thisOne);
    var old = editFact.oldObject;
    $scope.currentFirst = $scope.currentPerson.firstName;
    $scope.currentLast = $scope.currentPerson.lastName;
    $scope.numSeats = $scope.currentPerson.numSeats;
    $scope.currentTele = $scope.currentPerson.telephone;
    $scope.currentTime = $scope.currentPerson.timed;
    var addThis = newResFact.makeNewPerson($scope.currentFirst,$scope.currentLast,$scope.numSeats,$scope.currentTele);
    if ($scope.currentTime){
      addThis.timed = new Date($scope.currentTime);
    }
    $scope.cleanTimeout($localStorage.currPersonList[$scope.thisOne]);
    $localStorage.currPersonList.splice($scope.thisOne,1);
    newResFact.addToList(addThis);
    changed = $localStorage.currPersonList[$localStorage.currPersonList.length-1];
    editFact.oldObject = changed;
    $scope.processChanges(old,changed);
    $ionicHistory.goBack();
  }
})

.controller("followUpCtrl",function($scope,$localStorage,resArchive,editFact,$state){
  $scope.archiveList={};

  $scope.searchObject = {
    "firstName":undefined,
    "lastName":undefined,
    "telephone":undefined
  };

  $scope.searchActive = false;
  $scope.foundResults = false;
  $scope.noResults = false;

  $scope.archiveList.searchResults=[];

  $scope.anyOnchange = function(thisInput){
    if (thisInput.length == 0){
      thisInput = undefined;
    }
  }

  $scope.buttonClick = function(){
    $scope.searchStuff();
    if ($scope.archiveList.searchResults.length == 0){
      $scope.noResults = true;
    }
    else {
      $scope.foundResults = true;
    }
  }

  $scope.searchStuff = function(){
    $scope.archiveList.searchResults = [];
    $scope.searchActive = true;
    $scope.noResults = false;
    $scope.foundResults = false;
    $scope.archiveList.resultIndices = [];
    if ($scope.searchObject.firstName && $scope.searchObject.firstName.length>0){
      if (!$scope.searchObject.lastName && !$scope.searchObject.telephone){
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].firstName.toLowerCase() == $scope.searchObject.firstName.toLowerCase()){
            $scope.archiveList.searchResults.push($localStorage.archPersonList[l]);
            $scope.archiveList.resultIndices.push(l);
          }
        }
      }
      else if ($scope.searchObject.lastName && !$scope.searchObject.telephone) {
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].firstName.toLowerCase() == $scope.searchObject.firstName.toLowerCase() && $localStorage.archPersonList[l].lastName.toLowerCase() == $scope.searchObject.lastName.toLowerCase()){
            $scope.archiveList.searchResults.push($localStorage.archPersonList[l]);
            $scope.archiveList.resultIndices.push(l);
          }
        }
      }
      else if (!$scope.searchObject.lastName && $scope.searchObject.telephone){
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].telephone == $scope.searchObject.telephone && $localStorage.archPersonList[l].firstName.toLowerCase() == $scope.searchObject.firstName.toLowerCase()){
            $scope.archiveList.searchResults.push($localStorage.archPersonList[l]);
            $scope.archiveList.resultIndices.push(l);
          }
        }
      }
      else if ($scope.searchObject.lastName && $scope.searchObject.telephone){
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].firstName.toLowerCase() == $scope.searchObject.firstName.toLowerCase() && $localStorage.archPersonList[l].lastName.toLowerCase() == $scope.searchObject.lastName.toLowerCase() && $localStorage.archPersonList[l].telephone == $scope.searchObject.telephone){
            $scope.archiveList.searchResults.push($localStorage.archPersonList[l]);
            $scope.archiveList.resultIndices.push(l);
          }
        }
      }
    }
    else if ($scope.searchObject.lastName && !$scope.searchObject.firstName){
      if (!$scope.searchObject.telephone){
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].lastName.toLowerCase() == $scope.searchObject.lastName.toLowerCase()){
            $scope.archiveList.searchResults.push($localStorage.archPersonList[l]);
            $scope.archiveList.resultIndices.push(l);
          }
        }
      }
      else {
        for (var l=0;l<$localStorage.archPersonList.length;l++){
          if ($localStorage.archPersonList[l].lastName.toLowerCase() == $scope.searchObject.lastName.toLowerCase() && $localStorage.archPersonList[l].telephone == $scope.searchObject.telephone){
            $scope.archiveList.searchResults.push($localStorage.archPersonList[l]);
            $scope.archiveList.resultIndices.push(l);
          }
        }
      }
    }
    else if ($scope.searchObject.telephone && !$scope.searchObject.lastName && !$scope.searchObject.firstName){
      for (var l=0;l<$localStorage.archPersonList.length;l++){
        if ($localStorage.archPersonList[l].telephone == $scope.searchObject.telephone){
          $scope.archiveList.searchResults.push($localStorage.archPersonList[l]);
          $scope.archiveList.resultIndices.push(l);
        }
      }
    }
  }

  $scope.clearSearch = function(){
    // console.log($localStorage.archPersonList);
    $scope.searchObject = {
      "firstName":undefined,
      "lastName":undefined,
      "telephone":undefined
    };
    $scope.archiveList.searchResults = [];
    $scope.searchActive = false;
    $scope.foundResults = false;
    $scope.noResults = false;
  }

  $scope.handOff = function($index){
    editFact.newOldInd = $scope.archiveList.resultIndices[$index];
    $state.go("newOldRes");
  }

  $scope.newEntryClick=function(){
    $state.go("newEntry");
  }
})

.controller ("newOldResCtrl",function($scope,$ionicHistory,$localStorage,editFact,newResFact,$ionicPopup){
  $scope.person = editFact.loadHerUp($localStorage.archPersonList[editFact.newOldInd]);

  $scope.buttonOnclick=function(){
    if (!$scope.person.telephone){
      var thisPopup=$ionicPopup.alert({
        template:'<div class="item item-text-wrap">Please enter a telephone number</div>',
        title:'No telephone number',
      });
      alertPopup.then(function(res) {
        thisPopup.close();
      })
    }
    else {
      var myPopup=$ionicPopup.show({
        template:'<div display=inline-block><ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner><p align=center> Please Wait </p></div>',
        title:'Sending Message'
      });
      first=$scope.person.firstName;
      last=$scope.person.lastName;
      numSeats=$scope.person.numSeats || 1;
      tele=$scope.person.telephone;
      timed=($scope.person.timed);
      $scope.currentObj=newResFact.makeNewPerson(first,last,numSeats,tele);
      $localStorage.archPersonList.splice(editFact.newOldInd,1);
      var smsContent;
      if ($scope.person.timed){
        $scope.currentObj.timed=new Date(timed);
        smsContent='Welcome back, ' + first + ' ' + last + '. We are preparing your reservation for ' + numSeats + ' seats at ' + $filter("date")(timed, "shortTime") + ', and will send you an SMS when it is ready';
      }
      else {
        smsContent='Welcome back, ' + first + ' ' + last + '. We are preparing a table for ' + numSeats + ', and will send you an SMS when it is ready';
      }
      newResFact.addToList($scope.currentObj);
      // console.log(typeof $localStorage.currPersonList[$localStorage.currPersonList.length-1].timed);
      // console.log(smsContent);
      // console.log($localStorage.currPersonList[$localStorage.currPersonList.length-1].timed);
      // myPopup.close();
      // $ionicHistory.goBack(-2);
        $ionicPlatform.ready(function () {
          $cordovaSms
            .send(tele, smsContent)
            .then(function() {
              // $scope.person={};
              myPopup.close();
              $cordovaToast.showLongBottom('Message sent! Customer is waiting.').then(function(success) {
                $ionicHistory.goBack(-2);
              }, function (error) {
                // error
              });
            }, function(error) {
              alert ("An error occured while sending the message. Please try again.");
            });
          }
        );
    }
  }
})

.controller ('settingsCtrl',function($scope,$state,settingsFact,$ionicPopup,$localStorage,$ionicPlatform,$cordovaSms,$timeout){
  $scope.searchClick = false;
  $scope.searchText = 'Tap to open';
  $scope.searchObject = {};
  $scope.curResMassTextShow = false;
  $scope.archMassTextShow = false;
  $scope.sendAllResSubTxt = 'Tap to hide';
  $scope.sendAllArchSubTxt = 'Tap to open';
  $scope.massTextCont = {};

  $scope.batchCurConfirm = function() {
    if (!$scope.massTextCont.resMassTxt || $scope.massTextCont.resMassTxt.length<1){
      var alertPopup = $ionicPopup.alert({
        title: 'No text entered',
        template: 'Please enter text to be sent.'
      });
      alertPopup.then(function(res) {
      });
    }
    else if (!$localStorage.currPersonList || $localStorage.currPersonList.length<1){
      var alertPopup = $ionicPopup.alert({
        title: 'No current reservations',
        template: 'This message will not reach anybody, sorry!'
      });
      alertPopup.then(function(res) {
      });
    }
    else {
      var sendThis = '"' + $scope.massTextCont.resMassTxt + '"';
       var confirmPopup = $ionicPopup.confirm({
         title: 'Send following message to all current reservations?',
         template: sendThis
       });
       confirmPopup.then(function(res) {
         if(res) {
           $scope.sendAllRes();
         } else {
          //  console.log('That was close');
         }
       });
     }
  };


  $scope.sendAllRes = function(){
    var smsContent = $scope.massTextCont.resMassTxt;
    // console.log(smsContent);
    $ionicPlatform.ready(function () {
      for (var l=0;l<$localStorage.currPersonList.length;l++){
        tele = $localStorage.currPersonList[l].telephone;
        // console.log(tele);
        $cordovaSms
          .send(tele, smsContent)
          .then(function() {

          }, function(error) {
            alert ("An error occured while sending the message. Please try again.");
          });
        }
        $scope.massTextCont.resMassTxt = undefined;
      }
    )
  }

  $scope.batchArchConfirm = function() {
    if (!$scope.massTextCont.archMassTxt || $scope.massTextCont.archMassTxt.length<1){
      var alertPopup = $ionicPopup.alert({
        title: 'No text entered',
        template: 'Please enter text to be sent.'
      });
      alertPopup.then(function(res) {
      });
    }
    else if (!$localStorage.archPersonList || $localStorage.archPersonList.length<1){
      var alertPopup = $ionicPopup.alert({
        title: 'No past customers on record',
        template: 'This message will not reach anybody, sorry!'
      });
      alertPopup.then(function(res) {
      });
    }
    else {
      var sendThis = '"' + $scope.massTextCont.archMassTxt + '"';
       var confirmPopup = $ionicPopup.confirm({
         title: 'Send following message to all past customers?',
         template: sendThis
       });
       confirmPopup.then(function(res) {
         if(res) {
           $scope.sendAllArch();
         } else {
          //  console.log('That was close');
         }
       });
     }
  };

  $scope.sendAllArch = function(){
    var smsContent = $scope.massTextCont.archMassTxt;
    // console.log(smsContent);
    $ionicPlatform.ready(function () {
      for (var l=0;l<$localStorage.archPersonList.length;l++){
        tele = $localStorage.archPersonList[l].telephone;
        // console.log(tele);
        $cordovaSms
          .send(tele, smsContent)
          .then(function() {

          }, function(error) {
            alert ("An error occured while sending the message. Please try again.");
          });
        }
        $scope.massTextCont.archMassTxt = undefined;
      }
    )
  }

  $scope.archMassTextToggle = function(){
    if ($scope.archMassTextShow == false){
      $scope.archMassTextShow = true;
      $scope.sendAllArchSubTxt = 'Tap to hide';
    }
    else {
      $scope.archMassTextShow = false;
      $scope.sendAllArchSubTxt = 'Tap to open';
    }
  }

  $scope.curResMassTextToggle = function(){
    if (!$scope.curResMassTextShow){
      $scope.curResMassTextShow = true;
      $scope.sendAllResSubTxt = 'Tap to hide';
    }
    else {
      $scope.curResMassTextShow = false;
      $scope.sendAllResSubTxt = 'Tap to open';
    }
  }

  $scope.showCurConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Clear all current reservations?',
       template: 'This action is irreversible!'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $scope.clearCurr();
       } else {
        //  console.log('That was close');
       }
     });
  };

  $scope.clearCurr = function(){
    for (var i=0;i<$localStorage.currPersonList.length;i++){
      $timeout.cancel($localStorage.currPersonList[i].timeOut);
      $localStorage.currPersonList[i].timeOut = undefined;
    }
    $localStorage.currPersonList = [];
  }

  $scope.chronOnclick = function(){
    settingsFact.isChronological = true;
    settingsFact.isSearch = false;
    settingsFact.loadChronological();
    $state.go('settingsResults');
  }

  $scope.searchOnclick = function(){
    if (!$scope.searchClick){
      $scope.searchClick = true;
      $scope.searchText = 'Tap to hide';
    }
    else {
      $scope.searchClick = false;
      $scope.searchText = 'Tap to open';
    }
  }

  $scope.clearSearch = function(){
    $scope.searchObject = {
      "firstName":undefined,
      "lastName":undefined,
      "telephone":undefined
    };
  }

  $scope.buttonClick = function(){
    settingsFact.isChronological = false;
    settingsFact.isSearch = true;
    settingsFact.searchObject = $scope.searchObject;
    settingsFact.searchThis($scope.searchObject);
    $state.go('settingsResults');
  }

  $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete all customer records?',
       template: 'This action is irreversible!'
     });
     confirmPopup.then(function(res) {
       if(res) {
         settingsFact.deleteAll();
       } else {
        //  console.log('That was close');
       }
     });
  };

  $scope.deleteAllOnClick = function(){
    $scope.showConfirm();
  }
})

.controller('settingsResultsCtrl',function($scope,$state,settingsFact,editFact,$localStorage,$ionicPopup){
  $scope.resultArray = settingsFact.returnArray;
  $scope.resultIndices = settingsFact.resultIndices;

  $scope.delete = function(thisOne){
    settingsFact.returnArray.splice(thisOne,1);
    $localStorage.archPersonList.splice($scope.resultIndices[thisOne],1);
    settingsFact.resultIndices.splice(thisOne,1);
  }

  $scope.deleteOnclick = function($index){
    var titleString = 'Delete record for ' + $scope.resultArray[$index].firstName + ' ' + $scope.resultArray[$index].lastName + '?';
    var confirmPopup = $ionicPopup.confirm({
      title: titleString,
      template: 'This action is irreversible!'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $scope.delete($index);
      } else {
        // console.log('That was close');
      }
    });
  }

  $scope.goHere = function($index){
    editFact.oldObject = editFact.loadHerUp($scope.resultArray[$index]);
    editFact.newOldInd = $scope.resultIndices[$index];
    editFact.thisOne = $index;
    $state.go('editCust');
  }
})

.controller('editCustCtrl',function($scope,editFact,$localStorage,$ionicHistory,settingsFact){
  $scope.person = editFact.oldObject;
  $scope.buttonOnclick = function(){
    $localStorage.archPersonList[editFact.newOldInd].firstName = $scope.person.firstName;
    $localStorage.archPersonList[editFact.newOldInd].lastName = $scope.person.lastName;
    $localStorage.archPersonList[editFact.newOldInd].telephone = $scope.person.telephone;
    settingsFact.returnArray[editFact.thisOne].firstName = $scope.person.firstName;
    settingsFact.returnArray[editFact.thisOne].lastName = $scope.person.lastName;
    settingsFact.returnArray[editFact.thisOne].telephone = $scope.person.telephone;
    $ionicHistory.goBack();
  }
});
