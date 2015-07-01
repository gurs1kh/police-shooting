// Function to draw your map
var drawMap() = function() {
	
	// Create map and set viewd
	var map = L.map("container");
	map.setView([34, -100], 4);
	
	// Create an tile layer variable using the appropriate url
	layer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
	// Add the layer to your map
	layer.addTo(map);
	
	// Execute your function to get data
	getData();
}

// Function for getting data
var getData = function() {

	// Execute an AJAX request to get the data in data/response.js
	var data;
	$.ajax({
		 url:'response.json',
		 type: "get",
		 success:function(dat) {
		   data = dat
		 }, 
		 dataType:"json"
	});
	
	// When your request is successful, call your customBuild function
	customBuild(data);
}

// Do something creative with the data here!  
var customBuild = function() {

  
}


