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

	  //delete this
	  console.log("loggedIn = " + $localStorage.loggedIn);
	  console.log("netlinkid = " + $localStorage.netlinkid);
	  
	  $scope.menuLeft = [
	    {label:'Home', route:'/', glyphicon:'glyphicon glyphicon-home'},
	    {label:'About', route:'/about'},
	    {label:'Contact', route:'/contact'}
	   ]

	  $scope.menuRight = [
	    {label:'SignUp', route:'/signup', glyphicon:'glyphicon glyphicon-user', hide:$localStorage.loggedIn},
	    {label:'Login', route:'/login', glyphicon:'glyphicon glyphicon-log-in', hide:$localStorage.loggedIn}, 
	    {label:'My Bookings', route:'/bookings', glyphicon:'glyphicon glyphicon-list-alt', hide:!($localStorage.loggedIn)}, 
	    {label:'Profile', route:'/profile', glyphicon:'glyphicon glyphicon-user', hide:!($localStorage.loggedIn)}
	  ]

	  vm.hideLogout = !($localStorage.loggedIn);
	  console.log("logoutHide = " + vm.hideLogout);
	  

          vm.logout = function() {
	      $localStorage.token = null;
	      $localStorage.loggedIn = false;
	      $localStorage.netlinkid = null;
	      $localStorage.admin = false;
	      console.log("after log out, $localStorage.loggedIn = " + $localStorage.loggedIn);
	  };
	  
})
