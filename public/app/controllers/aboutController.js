'use strict';
//declare module

angular.module('userApp')

.controller('aboutController', function($localStorage, $rootScope){
	var vm = this;

	vm.message = $localStorage.loggedIn;

})
