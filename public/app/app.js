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

.controller('homeController', function($localStorage, $rootScope){
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

		
	}


	vm.title ="Library Study Room Booking"
	
	
	
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

