var drawMap = function() {
	$("#container").css("width", "800px");
	var map = L.map("container");
	map.setView([40, -95], 4);
	layer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
	layer.addTo(map);
	getData(map);
}

var getData = function(map) {
	$.ajax({
		 url:'data/response.json',
		 type: "get",
		 success:function(data) {
			customBuild(data, map);
		 }, 
		 dataType:"json"
	});
}

var customBuild = function(data, map) {
	var min = 2015;
	var max = 0;
	data.map(function(d){
		
		if (d["Date Searched"]) {
			var year = parseInt(d["Date Searched"].match("\\d{4}")[0]);
			if (year > max) max = year;
			if (year < min) min = year;
		}
		var circle = new L.circle([d.lat, d.lng], 200, {color:'blue', opacity:.5}).addTo(map);
		var info = document.createElement("p");
		info.innerHTML = "Agency Name: " + d["Agency Name"] + "<br />"
		+ "Armed or Unarmed?: " + d["Armed or Unarmed?:"] + "<br />"
		+ "Date Searched: " + d["Date Searched"] + "<br />"
		+ "Hispanic or Latino Origin: " + d["Hispanic or Latino Origin"] + "<br />"
		+ "Hit or Killed?: " + d["Hit or Killed?"] + "<br />"
		+ "Race: " + d["Race"] + "<br />"
		+ "Source Link: " + d["Source Link"] + "<br />"
		+ "City: " + d["City"] + "<br />"
		+ "State: " + d["State"] + "<br />"
		+ "Summary: " + d["Summary"] + "<br />"
		+ "Timestamp: " + d["Timestamp"] + "<br />"
		+ "Victim Name: " + d["Victim Name"] + "<br />"
		+ "Victim's Age: " + d["Victim's Age"] + "<br />"
		+ "Victim's Gender: " + d["Victim's Gender"] + "<br />"
		+ "Weapon: " + d["Weapon"];
		$("#info").replaceWith(info);
	});
	console.log("min " + min);
	console.log("max " + max);
}