'use strict';
//$http.post('/someUrl', data).success(successCallback);

//declare modules

angular.module('userApp', ['app.routes', 'ngStorage'])

.controller('navbarController', function($localStorage, $scope, $rootScope, $location) {
	  var vm = this;

	  if ($localStorage.token != null) {
		$rootScope.loggedIn = true;
	  } else {
	  	$rootScope.loggedIn = false;
	  };

	  console.log("loggedIn = " + $rootScope.loggedIn);
	  
	  $scope.menuLeft = [
	    {label:'Home', route:'/', glyphicon:'glyphicon glyphicon-home'},
	    {label:'About', route:'/about'},
	    {label:'Contact', route:'/contact'}
	   ]

	  $scope.menuRight = [
	    {label:'SignUp', route:'/signup', glyphicon:'glyphicon glyphicon-user', hide:$rootScope.loggedIn},
	    {label:'Login', route:'/login', glyphicon:'glyphicon glyphicon-log-in', hide:$rootScope.loggedIn}, 
	    {label:'Profile', route:'/profile', glyphicon:'glyphicon glyphicon-user', hide:!($rootScope.loggedIn)}
	  ]

	  vm.hideLogout = !($rootScope.loggedIn);
	  console.log("logoutHide = " + vm.hideLogout);
	  
	  
	  $scope.menuActive = '/';
	  
	  $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
              $scope.menuActive = $location.path();
          });

          vm.logout = function() {
	      $localStorage.token = null;
	      $rootScope.loggedIn = false;
	      console.log("after log out, $rootScope.loggedIn = " + $rootScope.loggedIn);

	  };

})

.controller('homeController', function($http, $localStorage, $rootScope){
	var vm = this;

	if ($localStorage.token != null) {
		$rootScope.loggedIn = true;
	  } else {
	  	$rootScope.loggedIn = false;
	};

	vm.hideCreateBooking = !($rootScope.loggedIn);

	vm.createBooking = function(booking, date) {
		console.log("create booking");
		console.log("booking = " + booking.roomNumber);
		console.log("date = " + date.month + " " + date.day + " from " + date.startTime + " to " + date.endTime);

		var months = {
  		  January: 0,
  		  February: 1,
 		  March: 2,
 		  April: 3,
 		  May: 4,
 		  June: 5,
 		  July: 6,
 		  August: 7,
 		  September: 8,
 		  October: 9,
 		  November: 10,
 		  December: 11,
		};
		
		var month = months[date.month];
		var hour = date.startTime.split(":")[0];
		var minutes = date.startTime.split(":")[1];

		//startTime raw date
		var start = new Date(2015, month, date.day, hour, minutes, 0, 0).getTime()
		
		//var duration = ;
	};


	vm.title ="Library Study Room Booking";


//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


	vm.checkAval = function(room, time, checkTime) {
		var bookingData = "/api/booking/byroom/" + room + "/" + time; //1/1436042817000
		$http.get(bookingData).
		success(function(data, status, headers, config) {
			console.log(status);
			console.log(data[checkTime]);
			if (data[checkTime] == true) {return true;} //ec8181
			else {return false;}
	    }).
	    error(function(data, status, headers, config) {
	  		//console.log("ERROR. data = " + data + ", status = " + status);
	    });
	};

//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
    
    
    /* Construct id for each cell in the time table */
    
    vm.timeS=["8:00am", "8:30am", "9:00am", "9:30am", "10:00am", "10:30am", "11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm",
	"1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", "4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm",
	"8:00pm", "8:30pm", "9:00pm", "9:30pm", "10:00pm"];
    vm.room = ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10"];
    vm.ids = [];
	var index = 0;
    for(var i = 0; i < vm.timeS.length; i++) {
		for(var j = 0; j < vm.room.length; j++) {
            vm.ids[index] = vm.timeS[i] + "-" + vm.room[j];
			index++;
		}
	}
    
    
    /* Construct table */
    
    vm.rooms = ["Room#/ Time", "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10"];
    vm.times=["8:00 am", "8:30 am", "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am", "12:00 pm", "12:30 pm", "1:00 pm",
	"1:30 pm", "2:00 pm", "2:30pm", "3:00pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm", "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm",
	"8:00 pm", "8:30 pm", "9:00 pm", "9:30 pm", "10:00 pm"];
    vm.table = [];
    index = 0;
    var maxNumberOfElementinaRow = 10;
    vm.table[0] = vm.rooms;
    for(var i = 1; i < vm.times.length + 1; i++) {
        vm.table[i] = [];
        vm.table[i][0] = vm.times[i];
        for(var j = 1; j < maxNumberOfElementinaRow + 1; j++) {
            vm.table[i][j] = vm.ids[index];
            index++;
        }
    }
    
    
    
    vm.isId = function(col) {
        var str = col.split("-");
        var time = str[0];
        var room = str[1];
        if(time.length === 0 || room.length === 0) {
            return false;
        }else {
//            window.alert("time: " + time + "\nroom: " + room);
            return true;
        }
    }
    
    vm.isHeader = function(col) {
        var str = col.split("-");
        var time = str[0];
        var room = str[1];
        
        if(time.length === 0 || room.length === 0) {
            return true;
        }else {
//            window.alert("time: " + time + "\nroom: " + room);
            return false;
        }
    }
    
    
    
    /* Response to click */
    
    vm.click = function(id) {
        var str = id.split("-");
        var time = str[0];
        var room = str[1];
        window.alert("time: " + time + "\nroom: " + room);
        
    }

})

.controller('aboutController', function($rootScope){
	var vm = this;

	vm.message = $rootScope.loggedIn;

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
		    $rootScope.loggedIn = true;
		    console.log("(in login controller) $rootScope.loggedIn = " + $rootScope.loggedIn);
		    
		    return;
		};

		var loginData = {
			'netlinkid' : user.username,
			'password' : user.password
		};
		$http.post('api/user/login', loginData).
			success(function(data, status, headers, config) {

			//correct login information
			if (data.success == true) {
				console.log("CORRECT USERNAME AND PASSWORD");
				vm.message = "Successfully logged in."

				$localStorage.token = data.token;
				$rootScope.loggedIn = true;

				console.log("local token = " + data.token);
				
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
		      'lastname' : user.lastname
		};
		$http.post('/api/user/register', userData).
		    success(function(data, status, headers, config) {
		    	console.log("SUCCESS. data = " + data + ", status = " + status);
		    }).
		    error(function(data, status, headers, config) {
		  	console.log("ERROR. data = " + data + ", status = " + status);
		    });

		console.log("REGISTER BUTTON CLICKED");
		console.log(user);

	};


}]);

