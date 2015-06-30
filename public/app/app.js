'use strict';

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

.controller('signupController', function(){


});
