'use strict';
//declare module

angular.module('userApp')

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
