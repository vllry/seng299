'use strict';
//declare module

angular.module('userApp')

.controller('contactController', function($localStorage, $rootScope){
	var vm = this;

	vm.message = $localStorage.loggedIn;

})
