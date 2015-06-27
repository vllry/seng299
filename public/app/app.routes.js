angular.module('app.routes', ['ngRoute'])

// Configuring the routes
.config(function($routeProvider, $locationProvider){

	$routeProvider

	// Route for home page
	.when("/", {
		templateUrl: 'app/views/pages/home.html',
		controller: 'homeController',
		controllerAs: 'home'
	})

	.when("/about", {
		templateUrl: 'app/views/pages/about.html'
		controller: 'aboutController'
		controllerAs: 'about'
	});

	// Added to remove the # from URLs
	$locationProvider.html5Mode(true);
});
