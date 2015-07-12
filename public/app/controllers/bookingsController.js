'use strict';
//declare module

angular.module('userApp')

.controller('bookingsController', function($http, $localStorage) {
	var vm = this;
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

	var currentDate = new Date();
    
    vm.year = currentDate.getFullYear();
    vm.month = currentDate.getMonth();
    vm.date = currentDate.getDate();
    
    vm.dates = [];
    var numberOfDatestoBeDisplayed = 14;
    for(var i = 0; i < numberOfDatestoBeDisplayed; i++) {
        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() + i);
        var temp = {
            "year": tempDate.getFullYear(),
            "month": tempDate.getMonth(),
            "date": tempDate.getDate()
        }
        vm.dates[i] = temp;
    }
    
    
    vm.chosenDate = {
    		"year": vm.year,
            "month": vm.month,
            "date": vm.date,
            "message": "(default)"
        }
    vm.getChosenDate = function(year, month, date) {
        vm.chosenDate = {
            "year": year,
            "month": month,
            "date": date,
            "message": ""
        }
        //window.alert("month = " + month + "\ndate = " + date);
    }
	vm.List = [];
	vm.someone = $localStorage.netlinkid;
	var postURL = '/api/user/'.concat($localStorage.netlinkid).concat("/bookings");

	vm.range = function(min, max, step){
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) input.push(i);
    return input;
  	};

	vm.getBookingsInfo = function() {
		$http.get(postURL).
			    success(function(data, status, headers, config) {
			    
				if (data.length == 0) {
					vm.hideMessage = false;
				}
			    
				for (var i = 0; i < data.length; i++) {
					vm.hideMessage = true;
					
					var start = new Date(data[i].startTime);
					var end = new Date(data[i].endTime);

					var bookingInfo = {
						roomid: data[i].roomid,
						startMonth: monthNames[start.getMonth()],
						startDate: start.getDate(),
						startTime: start.getHours().toString().concat(":").concat(twodigits(start.getMinutes()).toString()),

						endTime: end.getHours().toString().concat(":").concat(twodigits(end.getMinutes()).toString())
					}
						
					vm.List.push(bookingInfo);
				} //for
			    	vm.listLength = vm.List.length-1;
			    	console.log("length"+vm.listLength);
			    	console.log(vm.bookingsList);
			  
			    }).
			    error(function(data, status, headers, config) {
			  	console.log("ERROR. data = " + data + ", status = " + status);
			    });
	};
	vm.getOneBookingsInfo = function(num) {
		vm.List1=[];
		$http.get(postURL).
			    success(function(data, status, headers, config) {
			    
				if (data.length == 0) {
					vm.hideMessage = false;
				}
			    
					vm.hideMessage = true;
					
					var start = new Date(data[num].startTime);
					var end = new Date(data[num].endTime);

					var bookingInfo = {
						roomid: data[num].roomid,
						startMonth: monthNames[start.getMonth()],
						startDate: start.getDate(),
						startTime: start.getHours().toString().concat(":").concat(twodigits(start.getMinutes()).toString()),

						endTime: end.getHours().toString().concat(":").concat(twodigits(end.getMinutes()).toString())
					}
						
					vm.List1.push(bookingInfo);
				 //for
			    
			  
			    }).
			    error(function(data, status, headers, config) {
			  	console.log("ERROR. data = " + data + ", status = " + status);
			    });
	};

	function twodigits(number) {
    		return (number < 10 ? '0' : '') + number
	}

	vm.timeGenerator=function(year,month,date,time){
        var time1 = time.split(":");
        var hour = time1[0];
        var minutes = time1[1];
        var timeInMS=new Date(year, month, date, hour, minutes, 0, 0).getTime();
        return timeInMS;
    }
    vm.deleteBooking=function(room,year,month,date,starttime){
	 //get ms
	 //var timeInMS=starttime.getTime();
     /*var room = vm.bookingRoom;
     var starttime = vm.bookingTime;*/
     var timeInMS = vm.timeGenerator(vm.chosenDate["year"],vm.chosenDate["month"],vm.chosenDate["date"],starttime);
	 // var timeInMs = new Date(starttime,0.0).getTime();
	/*var year = vm.chosenDate["year"];
	var month = vm.chosenDate["month"];
	var date = vm.chosenDate["date"];
	var time = starttime.split(":");
	var hour = time[0];
	var minutes = time[1];
	var timeInMS=new Date(year, month, date, hour, minutes, 0, 0).getTime();*/

	 console.log(timeInMS);
     var bookingData={
     		'token' : $localStorage.token,
     		'roomid': room,
     		'starttime':timeInMS
      };
     $http.post('/api/booking/delete', bookingData)
      .success(function(data, status, headers, config) {
            //vm.checkMessage = data.message;
            window.alert(data.message);
	    })
       .error(function(data, status, headers, config) {
	  	console.log("there wasn't a booking");
	    });
	}

    vm.EditBooking=function(duration,room,year,month,date,starttime){
/*    var room = vm.bookingRoom;
    var starttime = vm.bookingTime;
    console.log(duration);
 // var timeInMs = new Date(starttime,0.0).getTime();
    var year = vm.chosenDate["year"];
    var month = vm.chosenDate["month"];
    var date = vm.chosenDate["date"];
    var time = starttime.split(":");
    var hour = time[0];
    var minutes = time[1];
    var timeInMS=new Date(year, month, date, hour, minutes, 0, 0).getTime();*/
    var timeInMS = vm.timeGenerator(vm.chosenDate["year"],vm.chosenDate["month"],vm.chosenDate["date"],starttime);
 	console.log(timeInMS);
 	var bookingData={
        'token':$localStorage.token,
        'roomid': room,
        'starttime':timeInMS,
        'duration':duration
  	};
 	$http.post('/api/booking/update', bookingData)

 	.success(function(data, status, headers, config) {
        //vm.checkMessage = data.message;
        //window.alert(data.message);
    })
   	.error(function(data, status, headers, config) {
    console.log("there wasn't a booking");
    });

   
} //Editing Booking
});
