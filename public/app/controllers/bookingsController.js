'use strict';
//declare module

angular.module('userApp')

.controller('bookingsController', function($http, $localStorage) {
	var vm = this;
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

	vm.List = [];

	var postURL = '/api/user/'.concat($localStorage.netlinkid).concat("/bookings");

	vm.getBookingsInfo = function() {
		$http.get(postURL).
			    success(function(data, status, headers, config) {
				if (data.length == 0) {
					vm.hideMessage = false;
				}
			    
				for (var i = 0; i < data.length; i++) {
					vm.hideMessage = true;
					
					var start = new Date(data[i].startTime);
					var end = new Date(data[i].endTime);

					var bookingInfo = {
						roomid: data[i].roomid,
						startMonth: monthNames[start.getMonth()],
						startDate: start.getDate(),
						startTime: start.getHours().toString().concat(":").concat(twodigits(start.getMinutes()).toString()),

						endTime: end.getHours().toString().concat(":").concat(twodigits(end.getMinutes()).toString())
					}
						
					vm.List.push(bookingInfo);
				} //for
			    
			    	console.log(vm.bookingsList);
			  
			    }).
			    error(function(data, status, headers, config) {
			  	console.log("ERROR. data = " + data + ", status = " + status);
			    });
	};

	function twodigits(number) {
    		return (number < 10 ? '0' : '') + number
	}

});
