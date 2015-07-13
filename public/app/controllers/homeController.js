'use strict';
//declare module

angular.module('userApp')

.controller('homeController', function($http, $localStorage){
	var vm = this;
	vm.title ="Library Study Room Booking";


	vm.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	

    
    var currentDate = new Date();
    
    vm.year = currentDate.getFullYear();
    vm.month = currentDate.getMonth();
    vm.date = currentDate.getDate();
    
    vm.dates = [];
    var numberOfDatestoBeDisplayed = 17;
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
/*    vm.getChosenDate = function(year, month, date) {
        vm.chosenDate = {
            "year": year,
            "month": month,
            "date": date,
            "message": ""
        }
        console.log(vm.chosenDate);
        changeHtmlClass1();
        vm.populateCalendar();
        $("#main").load(document);
        

        //window.alert("month = " + month + "\ndate = " + date);
    }*/



     /* Construct id for each cell in the time table */
    
    vm.timeS=[ "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
    vm.room = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    vm.ids = [];
    var index = 0;
    for(var i = 0; i < vm.timeS.length; i++) {
		for(var j = 0; j < vm.room.length; j++) {
          	    vm.ids[index] = vm.timeS[i] + "-" + vm.room[j];
		    index++;
		}
	}
    
    
    /* Construct table */
    
    vm.rooms = ["Room#/ Time", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    vm.times=["", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
    
    vm.header = [];
    vm.header[0] = vm.rooms;
    
    vm.table = [];
    index = 0;
    var maxNumberOfElementinaRow = 10;
    vm.table[0] = vm.rooms;
    for(var i = 1; i < vm.times.length; i++) {
        vm.table[i] = [];
        var temp = {"link":vm.times[i] , "id": vm.times[i], "htmlClass": "", "htmlClass1": ""};
        vm.table[i][0] = temp;
        for(var j = 1; j < maxNumberOfElementinaRow + 1; j++) {
            temp = {"link": "+", "id": vm.ids[index], "htmlClass": "available", "htmlClass1": "available1"};
            vm.table[i][j] = temp;
            index++;
        }
    }
    
    
    var changeHtmlClass = function(id) {
        for(var i = 0; i < vm.table.length; i++) {
            for(var j = 0; j < vm.table[0].length; j++) {
                if(vm.table[i][j]["id"] === id) {
                    vm.table[i][j]["htmlClass"] = "notAvailable";
                    vm.table[i][j]["htmlClass1"] = "notAvailable1";
                }
            }
        }
    }

    var changeHtmlClass1 = function(id) {
        for(var i = 1; i < vm.table.length; i++) {
            for(var j = 0; j < vm.table[0].length; j++) {
                
                    vm.table[i][j]["htmlClass"] = "Available";
                    vm.table[i][j]["htmlClass1"] = "Available1";
            }
        }
    }

    vm.getChosenDate = function(year, month, date) {
        vm.chosenDate = {
            "year": year,
            "month": month,
            "date": date,
            "message": ""
        }
        console.log(vm.chosenDate);
        changeHtmlClass1();
        vm.populateCalendar();
        $("#main").load(document);
        

        //window.alert("month = " + month + "\ndate = " + date);
    }

	function Create2DArray(rows) {
  		var arr = [];

  		for (var i=0;i<rows;i++) {
     		arr[i] = [];
  		}

  		return arr;
		}

    
    
    vm.populateCalendar = function() {
		vm.list = Create2DArray(43);
		for (var room = 1; room <= 10; room++) { //For each room
			var date = new Date();
            var time1 = vm.timeGenerator(vm.chosenDate["year"],vm.chosenDate["month"],vm.chosenDate["date"],'8:00');
            console.log(time1);
			var bookingData = "/api/booking/byroom/" + room.toString() + "/" + time1; //Example: /api/booking/byroom/1/1436042817000
			
			$http.get(bookingData).
			success(function(data, status, headers, config) {
				console.log(status);
				for (var timeSlot = 16; timeSlot <= 43; timeSlot++) {
					var hours = Math.floor(timeSlot/2).toString();
					var minutes = '00';
					if (timeSlot % 2) {
						minutes = '30';
					}



			
					//IMPORTANT NOTE: you cannot reference variable room because this is asynchronous.
					var curBlock = data[hours+':'+minutes];
					//console.log('room:' + room);
					/*console.log(hours);
					console.log(minutes);
					console.log(vm.list[room][hours+':'+minutes]);*/
					if (curBlock['bookedBy'] != undefined) {
						vm.list[curBlock['roomid']][hours+':'+minutes] = curBlock;
						console.log('booking in ' + curBlock['roomid'] + ' at ' + hours+':'+minutes);
                        
                        var id = hours + ':' + minutes + '-' + curBlock['roomid'];
                            changeHtmlClass(id); //Update table cell to reflect (un)availability
					}
				}
			}).

			error(function(data, status, headers, config) {
		  		console.log("ERROR. data = " + data + ", status = " + status);
			});
		}

	};
    
    
  


	//This runs populateCalendar() once the page has loaded.
    angular.element(document).ready(function () {
        
        vm.populateCalendar();
        
    });

    if ($localStorage.token != null) {
	$localStorage.loggedIn = true;
    } else {
	$localStorage.loggedIn = false;
    };

    vm.hideCreateBooking = !($localStorage.loggedIn);
    
    vm.hideEditButton = false;  
    vm.hideDeleteButton = false;
    vm.hideBookedBy = false;
    vm.hideDuration = false;
    /* Response to click */
    vm.click = function(id) {
        document.getElementById("laptop").checked = false;
        document.getElementById("projector").checked = false;
    	vm.checkMessage = "";
        var str = id.split("-");
        vm.bookingTime = str[0]; // booking time
        vm.bookingRoom = str[1]; // booking room
        vm.button = '';
        //console.log(id);
        console.log( vm.list[parseInt(str[1])][str[0]] );
        if (vm.list[parseInt(str[1])][str[0]] != undefined)
        {
		vm.hideBookedBy = false;
		vm.hideCreateBooking = true;
		
        	if($localStorage.netlinkid == vm.list[parseInt(str[1])][str[0]]['bookedBy']['netlinkid']){
        	vm.someone = vm.list[parseInt(str[1])][str[0]]['bookedBy']['firstName'];
            
            if(vm.list[parseInt(str[1])][str[0]]['projector'] != ""){
                console.log("has proj");
                document.getElementById("projector").checked = true;
            }else{
                console.log("dont have proj");
                document.getElementById("projector").checked = false;
            }

            if(vm.list[parseInt(str[1])][str[0]]['laptop'] != ""){
                console.log("has laptop");
                document.getElementById("laptop").checked = true;
            }else{
                console.log("dont have laptop");
                document.getElementById("laptop").checked = false;
            }
        	

            vm.hideDeleteButton = false;
                vm.hideEditButton = false;
                vm.hideDuration = false;
        		vm.button = 'SAVE';
        	    //booked by me
        	} else {
        	vm.hideDeleteButton = true;
                vm.hideEditButton = true;
                vm.hideDuration = true;
        		vm.someone = vm.list[parseInt(str[1])][str[0]]['bookedBy']['firstName'];//booking by someone else
        		
        	}
        } else {

            vm.hideDeleteButton = true;
            
	    if ($localStorage.token != null) {
		$localStorage.loggedIn = true;
	    } else {
	  	$localStorage.loggedIn = false;
	    };

	    vm.hideCreateBooking = !($localStorage.loggedIn); 
            vm.hideBookedBy = true;
            vm.hideEditButton = true;
            vm.hideDuration = false;
        	vm.button = 'Create Booking';
            
        }
    }
    
   
        vm.proj = 0;
        vm.laptop = 0;
        

	vm.createBooking = function(duration) {
		var year = vm.chosenDate["year"];
		var month = vm.chosenDate["month"];
		var date = vm.chosenDate["date"];
		var startTime = vm.bookingTime;
		var time = startTime.split(":");
		var hour = time[0];
		var minutes = time[1];

		if (vm.proj == true || vm.proj == 1) {
			vm.proj = 1;
		} else {
			vm.proj = 0;
		}

		if (vm.laptop == true || vm.laptop == 1) {
			vm.laptop = 1;
		} else {
			vm.laptop = 0;
		}

		//startTime raw date
		var start = new Date(year, month, date, hour, minutes, 0, 0).getTime();

		var bookingData = {
			'token' : $localStorage.token,
			'netlinkid' : $localStorage.netlinkid,
			'starttime' : start,
			'duration' : duration,
			'roomid' : vm.bookingRoom,
			'requestlaptop' : vm.laptop,
			'requestprojector' : vm.proj
		};

	$http.post('/api/booking/create', bookingData)
           .success(function(data, status, headers, config) {
                //vm.checkMessage = data.message;
                window.alert(data.message);
                if (data.success == true) {
                	vm.proj = 0;
                    vm.laptop = 0;
                    location.href = ("/");
                }
	    })
           .error(function(data, status, headers, config) {
		  	console.log("booking create error");
	    });
	} //createBooking
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
            location.href = ("/");
	})
       .error(function(data, status, headers, config) {
	  	console.log("there wasn't a booking");
	});
	}
    

     //Edit Booking
/*     vm.EditBooking=function(duration){
        var room = vm.bookingRoom;
        var starttime = vm.bookingTime;
        console.log(duration);
     // var timeInMs = new Date(starttime,0.0).getTime();
        var year = vm.chosenDate["year"];
        var month = vm.chosenDate["month"];
        var date = vm.chosenDate["date"];
        var time = starttime.split(":");
        var hour = time[0];
        var minutes = time[1];
        var timeInMS=new Date(year, month, date, hour, minutes, 0, 0).getTime();

        if (vm.proj == true || 1) {
            vm.proj = 1;
        } else {
            vm.proj = 0;
        }

        if (vm.laptop == true || 1) {
            vm.laptop = 1;
        } else {
            vm.laptop = 0;
        }

     console.log(timeInMS);
     var bookingData={
            'token':$localStorage.token,
            'roomid': room,
            'starttime':timeInMS,
            'duration':duration,
            'requestprojector': vm.proj,
            'requestlaptop': vm.laptop
      };
     $http.post('/api/booking/update', bookingData)
      .success(function(data, status, headers, config) {
            //vm.checkMessage = data.message;
            //window.alert(data.message);
            if (data.success == true) {
            	location.href = ("/");
            }
      })
      .error(function(data, status, headers, config) {
            console.log("there wasn't a booking");
      });

       
    } //Editing Booking*/





    vm.EditBooking=function(duration){
        //vm.laptop=0;
        //vm.proj=0;
        
        var room = vm.bookingRoom;
        var starttime = vm.bookingTime;
        console.log(duration);
     // var timeInMs = new Date(starttime,0.0).getTime();
        var year = vm.chosenDate["year"];
        var month = vm.chosenDate["month"];
        var date = vm.chosenDate["date"];
        var time = starttime.split(":");
        var hour = time[0];
        var minutes = time[1];
        var timeInMS=new Date(year, month, date, hour, minutes, 0, 0).getTime();
        
        if (vm.proj == true || vm.proj==1) {
            vm.proj = 1;
        } else {
            vm.proj = 0;
        }
        if (vm.laptop == true || vm.laptop==1) {
            vm.laptop = 1;
        } else {
            vm.laptop = 0;
        }
     //console.log(timeInMS);
     var bookingData={
            'token':$localStorage.token,
            'roomid': room,
            'starttime':timeInMS,
            'duration':duration,
            'requestlaptop' : vm.laptop,
            'requestprojector' : vm.proj
      };
     $http.post('/api/booking/update', bookingData)
      .success(function(data, status, headers, config) {
            //vm.checkMessage = data.message;
            //window.alert(data.message);
            if (data.success == true) {
                location.href = ("/");
            }
      })
      .error(function(data, status, headers, config) {
            console.log("there wasn't a booking");
      });
       
    } //Editing Booking
})












