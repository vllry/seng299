//angular.module('Authentication', []);

angular.module('app.routes', ['ngRoute'])

// Configuring the routes
.config(function($routeProvider, $locationProvider){

	$routeProvider
	  // Route for home page
	  .when("/", {
		templateUrl: '/app/views/pages/home.html',
		controller: 'homeController',
		controllerAs: 'home'
	  })

	  .when("/about", {
		templateUrl: '/app/views/pages/about.html',
		controller: 'aboutController',
		controllerAs: 'about'
	  })

	  .when("/login", {
	  	templateUrl: '/app/views/pages/login.html',
	  	controller: 'loginController',
	  	controllerAs: 'login'
	  })

	  .when("/signup", {
	  	templateUrl: '/app/views/pages/signup.html',
	  	controller: 'signupController',
	  	controllerAs: 'signup'

	  })
	  .when("/bookings",{
	  	templateUrl: '/app/views/pages/bookings.html',
	  	controller: 'bookingsController',
	  	controllerAs: 'bookings'
	  })

	  .when("/profile", {
	  	templateUrl: '/app/views/pages/profile.html',
	  	controller: 'profileController',
	  	controllerAs: 'profile'
	  })
	  .when("/contact",{
	  	templateUrl:'/app/views/pages/contact.html',
	  	controller: 'contactController',
	  	controllerAs: 'contact'
	  })
	  

	  .otherwise('/');
	  

	// Added to remove the # from URLs
	$locationProvider.html5Mode(true);
});
