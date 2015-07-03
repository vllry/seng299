'use strict';
//$http.post('/someUrl', data).success(successCallback);

//declare modules

angular.module('userApp', ['app.routes'])

.controller('homeController', function(){
	var vm = this;

	// basic variable to display
	vm.message ="Library Study Room Booking"

	
})

.controller('aboutController', function(){
	var vm = this;

	vm.message = "THIS IS THE ABOUT PAGE"

})

.controller('loginController', function(){
	var vm = this;

	

})

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
		console.log(userData);

	};


}]);
