'use strict';
//$http.post('/someUrl', data).success(successCallback);

//declare modules

angular.module('userApp', ['app.routes', 'ngStorage'])

.controller('homeController', function(){
	var vm = this;

	// basic variable to display
	vm.message ="Library Study Room Booking"

	
})

.controller('aboutController', function(){
	var vm = this;

	vm.message = "THIS IS THE ABOUT PAGE"

})

.controller('loginController', ['$http', '$localStorage', function($http, $localStorage){
	var vm = this;

	vm.loginUser = function(user) {
		vm.submitted = true;
		vm.message = ""

		// If form is invalid, return and let AngularJS show validation errors.
		if (user.$invalid) {
		    return;
		}

		var loginData = {
			'netlinkid' : user.username,
			'password' : user.password
		};
		$http.post('api/user/login', loginData).
			success(function(data, status, headers, config) {

			if (data.success == true) {
				console.log("CORRECT USERNAME AND PASSWORD");
				vm.message = "Successfully logged in."

				$localStorage.token = data.token;

				console.log("local token = " + data.token);
			} else if (data.message == "User does not exist") {
				console.log("USER DOES NOT EXIST");
				vm.message = "Username does not exist."
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
