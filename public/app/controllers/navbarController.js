'use strict';
//declare module

angular.module('userApp')

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
