var drawMap = function() {
	var map = L.map("map");
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
	var circles = new Array();
	data.map(function(d){
		//console.log(d);
		var text = d.offense_type;
		if (d["Date Searched"]) {
			var year = parseInt(d["Date Searched"].match("\\d{4}")[0]);
			if (year > max) max = year;
			if (year < min) min = year;
		}
		var circle = new L.circle([d.lat, d.lng], 1000, {color:'blue', opacity:.5}).addTo(map);
		circle.year = year;
		circle.selected = false;
		circles.push(circle);
		var info = $(document.createElement("p"));
		info.html("<h1>Information</h1>");
		for (key in d) {
			if (key != "lat" && key != "lng") {
				var row = $(document.createElement("span"));
				row.addClass("row");
				var term = $(document.createElement("span"));
				term.addClass("term");
				term.text(key + ":");
				row.html(term);
				row.append("\t" + d[key]);
				info.append(row);
				info.append("<br />");
			}
		}
		
		var popup = L.popup()
			.setLatLng([d.lat + 1, d.lng])
			.setContent(d["City"] + ", " + (d["State"] ? d["State"].substring(0, 2) : d["State"]));
		
		circle.on("click", function(e) {
			$("#info").html(info);
			circles.map(function(c) { c.setRadius(1000); c.selected = false; });
			circle.setRadius(100000);
			circle.selected = true;
		}).on('mouseover', function (e) {
			circle.setRadius(100000);
            popup.openOn(map);
        }).on('mouseout', function (e) {
			circle.setRadius(e.target.selected ? 100000 : 1000);
			popup._close();
        });
	});
	
	min = Math.floor(min / 5) * 5;
	max = Math.ceil(max / 5) * 5;
	setupSlider(min, max, map, circles);
}

function setupSlider(min, max, map, circles) {
	$("#min-year, #max-year").attr("min", min).attr("max", max);
	$("#min-year").val(min);
	$("#max-year").val(max);
	
	var slider = document.getElementById("slider");
	var steps = [];
	for (var i = min; i <= max; i++) {
		if (i == min || i == max || i % 5 == 0)
			steps.push(i);
	}
	
	noUiSlider.create(slider, {
		start: [min, max],
		step: 1,
		connect: true,
		orientation: 'horizontal',
		behaviour: 'tap-drag',
		range: {
			'min': min,
			'max': max
		},
		pips: {
			mode: 'values',
			values: steps,
			density: 2
		}
	});
	
	slider.noUiSlider.on("change", function() {
		var vals = slider.noUiSlider.get();
		updateMap(map, circles, vals);
		$("#min-year").val(Math.round(vals[0]));
		$("#max-year").val(Math.round(vals[1]));
	});
	
	$("#min-year, #max-year").on("change", function() {
		slider.noUiSlider.set([$("#min-year").val(), $("#max-year").val()]);
		updateMap(map, circles, slider.noUiSlider.get());
	});
}

function updateMap(map, circles, vals) {
	circles.map(function(circle) { map.removeLayer(circle) });
	circles.filter(function(circle) {
		return circle.year >= vals[0] && circle.year <= vals[1];
	}).map(function(circle) { circle.addTo(map); });
}