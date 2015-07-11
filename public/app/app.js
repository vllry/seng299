'use strict';
//$http.post('/someUrl', data).success(successCallback);

//declare modules

angular.module('userApp', ['app.routes', 'ngStorage', 'ngDialog'])

.controller('navbarController', function($localStorage, $scope, $rootScope, $location) {
	  var vm = this;

	  if ($localStorage.token != null) {
		$localStorage.loggedIn = true;
	  } else {
	  	$localStorage.loggedIn = false;
	  };

	  console.log("loggedIn = " + $localStorage.loggedIn);
	  
	  $scope.menuLeft = [
	    {label:'Home', route:'/', glyphicon:'glyphicon glyphicon-home'},
	    {label:'About', route:'/about'},
	    {label:'Contact', route:'/contact'}
	   ]

	  $scope.menuRight = [
	    {label:'SignUp', route:'/signup', glyphicon:'glyphicon glyphicon-user', hide:$localStorage.loggedIn},
	    {label:'Login', route:'/login', glyphicon:'glyphicon glyphicon-log-in', hide:$localStorage.loggedIn}, 
	    {label:'Profile', route:'/profile', glyphicon:'glyphicon glyphicon-user', hide:!($localStorage.loggedIn)}
	  ]

	  vm.hideLogout = !($localStorage.loggedIn);
	  console.log("logoutHide = " + vm.hideLogout);
	  

          vm.logout = function() {
	      $localStorage.token = null;
	      $localStorage.loggedIn = false;
	      console.log("after log out, $localStorage.loggedIn = " + $localStorage.loggedIn);
	  };
	  
})

.controller('homeController', function($http, $localStorage, $rootScope){
	var vm = this;
	vm.title ="Library Study Room Booking";


	vm.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	

    
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



     /* Construct id for each cell in the time table */
    
    vm.timeS=[ "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
	"13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
	"20:00", "20:30", "21:00", "21:30", "22:00"];
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
    vm.times=["", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
	"13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
	"20:00", "20:30", "21:00", "21:30", "22:00"];
    
    vm.header = [];
    vm.header[0] = vm.rooms;
    
    vm.table = [];
    index = 0;
    var maxNumberOfElementinaRow = 10;
    vm.table[0] = vm.rooms;
    for(var i = 1; i < vm.times.length; i++) {
        var tempIndex = i;
        vm.table[tempIndex] = [];
        var temp = {"link":vm.times[tempIndex] , "id": vm.times[tempIndex], "htmlClass": ""};
        vm.table[tempIndex][0] = temp;
        for(var j = 1; j < maxNumberOfElementinaRow + 1; j++) {
            temp = {"link": "+", "id": vm.ids[index], "htmlClass": "available"};
            vm.table[tempIndex][j] = temp;
            index++;
        }
    }
    
    
    var changeHtmlClass = function(id) {
        for(var i = 0; i < vm.table.length; i++) {
            for(var j = 0; j < vm.table[0].length; j++) {
                if(vm.table[i][j]["id"] === id) {
                    vm.table[i][j]["htmlClass"] = "notAvailable";
                }
            }
        }
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
			var bookingData = "/api/booking/byroom/" + room.toString() + "/" + date.getTime(); //Example: /api/booking/byroom/1/1436042817000
			
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
						//HERE is where you should insert your code or function call to re-colour booked slots in the table
                        
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
		$rootScope.loggedIn = true;
	  	} else {
	  		$rootScope.loggedIn = false;
		};

	vm.hideCreateBooking = !($rootScope.loggedIn);  
    vm.hideDeleteButton = false;
    vm.hideBookedBy = true;

    /* Response to click */
    vm.click = function(id) {
    	vm.checkMessage = "";
        var str = id.split("-");
        vm.bookingTime = str[0]; // booking time
        vm.bookingRoom = str[1]; // booking room
        vm.button = '';
        console.log(id);
        console.log( vm.list[parseInt(str[1])][str[0]] );
        if (vm.list[parseInt(str[1])][str[0]] != undefined)
        {

        	if($localStorage.netlinkid == vm.list[parseInt(str[1])][str[0]]['bookedBy']['netlinkid']){
        		vm.someone = vm.list[parseInt(str[1])][str[0]]['bookedBy']['firstName'];
        		vm.hideDeleteButton = false;
        		vm.button = 'SAVE';
        		return;//booked by me
        	} else {
        		vm.hideCreateBooking = true;
        		vm.hideDeleteButton = true;
        		vm.someone = vm.list[parseInt(str[1])][str[0]]['bookedBy']['firstName'];//booking by someone else
        		return;
        	}
        }
        else{
        	vm.hideDeleteButton = true;
        	vm.hideBookedBy = true;
        	vm.button = 'Create Booking';
        }
    }
    
    if ($localStorage.token != null) {
		$localStorage.loggedIn = true;
	  } else {
	  	$localStorage.loggedIn = false;
	};

	vm.hideCreateBooking = !($localStorage.loggedIn);

	vm.createBooking = function(duration) {
		var year = vm.chosenDate["year"];
		var month = vm.chosenDate["month"];
		var date = vm.chosenDate["date"];
		var startTime = vm.bookingTime;
		var time = startTime.split(":");
		var hour = time[0];
		var minutes = time[1];
		

		//startTime raw date
		var start = new Date(year, month, date, hour, minutes, 0, 0).getTime();

		var bookingData = {
			'token' : $localStorage.token,
			'netlinkid' : $localStorage.netlinkid,
			'starttime' : start,
			'duration' : duration,
			'roomid' : vm.bookingRoom
		};

		$http.post('/api/booking/create', bookingData)
           .success(function(data, status, headers, config) {
                //vm.checkMessage = data.message;
                window.alert(data.message);
		    })
           .error(function(data, status, headers, config) {
		  	console.log("booking create error");
		    });
	} //createBooking
    
    vm.deleteBooking=function(starttime,id){
	 //get ms
	 //var timeInMS=starttime.getTime();
     var room = vm.bookingRoom;
     var starttime = vm.bookingTime;
	 // var timeInMs = new Date(starttime,0.0).getTime();
	var year = vm.chosenDate["year"];
	var month = vm.chosenDate["month"];
	var date = vm.chosenDate["date"];
	var time = starttime.split(":");
	var hour = time[0];
	var minutes = time[1];
	var timeInMS=new Date(year, month, date, hour, minutes, 0, 0).getTime();

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
    
   
    
    
    

})

.controller('aboutController', function($localStorage, $rootScope){
	var vm = this;

	vm.message = $localStorage.loggedIn;

})

.controller('loginController', ['$http', '$localStorage', '$rootScope', function($http, $localStorage, $rootScope){
	var vm = this;

	vm.loginUser = function(user, $location) {
		vm.submitted = true;
		vm.message = ""

		// If form is invalid, return and let AngularJS show validation errors.
		if (user.$invalid) {
		    return;
		} else if ($localStorage.token != null) {
		    vm.message = "Already logged in!"

		    //delete this
		    console.log("user token = " + $localStorage.token);
		    $localStorage.loggedIn = true;
		    console.log("(in login controller) $localStorage.loggedIn = " + $localStorage.loggedIn);
		    
		    return;
		};

		var loginData = {
			'netlinkid' : user.username,
			'password' : user.password
		};
		$http.post('/api/user/login', loginData).
			success(function(data, status, headers, config) {

			//correct login information
			if (data.success == true) {
				console.log("CORRECT USERNAME AND PASSWORD");
				vm.message = "Successfully logged in."

				$localStorage.token = data.token;
				$localStorage.netlinkid = user.username;
				$localStorage.loggedIn = true;
				
			//username no in database
			} else if (data.message == "User does not exist") {
				console.log("USER DOES NOT EXIST");
				vm.message = "Username does not exist."
			//invalid password
			} else {
				console.log("INVALID PASSWORD");
				vm.message = "Invalid Password."
			};

			
		    	console.log("SUCCESS. data = " + data + ", status = " + status);
		    	console.log("data.message = " + data.message);
		    	console.log("data.success = " + data.success);
		    }).
		    error(function(data, status, headers, config) {
		  	console.log("ERROR. data = " + data + ", status = " + status);
		    });

		console.log("LOGIN BUTTON CLICKED");

	};
	

}])

.controller('signupController', ['$http', function($http){
	var vm = this;

	vm.message = "REGISTRATION PAGE"

	vm.createUser = function(user) {
		// Trigger validation flag.
		vm.submitted = true;

		// If form is invalid, return and let AngularJS show validation errors.
		if (user.$invalid) {
		    return;
		}
	
		var userData = {
		      'netlinkid' : user.netlinkid,
		      'password' : user.password,
		      'firstname' : user.firstname,
		      'lastname' : user.lastname,
		      'studentid' : user.studentid,
		      'usertype' : user.type,
		      'department' : user.department,
		      'role' : 'user'
		};
		$http.post('/api/user/register', userData).
		    success(function(data, status, headers, config) {
		    	console.log("SUCCESS. data = " + data + ", status = " + status);

			window.alert(data.message);
			if (data.success == true) {
				//REDIRECT TO MAIN PAGE
				location.href = "/";
			};
		    }).
		    error(function(data, status, headers, config) {
		  	console.log("ERROR. data = " + data + ", status = " + status);
		    });

		console.log("REGISTER BUTTON CLICKED");
		console.log(user);

	};


}])

.controller('profileController', function($http, $localStorage) {
	var vm = this;

	console.log("this user's token: " + $localStorage.token);
	console.log("this user's netlinkid: " + $localStorage.netlinkid);

	var postURL = '/api/user/'.concat($localStorage.netlinkid);
	var token = {
		'token' : $localStorage.token
	};

	vm.getProfileInfo = function() {
		$http.post(postURL, token).
			    success(function(data, status, headers, config) {
			    	console.log("get user data success");
			    	console.log("first name = " + data.firstName);
			    	console.log("last name = " + data.lastName);
			    	console.log("user type = " + data.userType);

				vm.netlinkid = $localStorage.netlinkid;
				vm.firstName = data.firstName;
				vm.lastName = data.lastName;
				vm.password = "********";
				vm.email = $localStorage.netlinkid.concat("@uvic.ca");
				vm.type = data.userType;
				vm.department = data.department;
			  
			    }).
			    error(function(data, status, headers, config) {
			  	console.log("ERROR. data = " + data + ", status = " + status);
			    });
	};

	vm.update = function() {
		var updateInfo = {
			'token' : $localStorage.token,
			'firstname' : vm.firstName,
			'lastname' : vm.lastName,
			'department' : vm.department,
		};

		if (vm.password != "********") {
			updateInfo['password'] = (vm.password);
		} 

		console.log(updateInfo);
		$http.put(postURL, updateInfo).
			success(function(data, status, headers, config) {
			
		    	console.log("AFTER CHANGES:");
			console.log("netlinkid = " + vm.netlinkid);
			console.log("first name = " + vm.firstName);
			console.log("last name = " + vm.lastName);
			console.log("password = " + vm.password);
			console.log("email = " + vm.email);
			console.log("user type = " + vm.type);
			console.log("department = " + vm.department);
		  
		    }).
		    error(function(data, status, headers, config) {
		  	console.log("ERROR. data = " + data + ", status = " + status);
		    });
	};

	//post to /api/users/[netlinkid] with parameter token: $localStorage.token

	

});



