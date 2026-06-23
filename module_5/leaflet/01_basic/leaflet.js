// MAP INITIALIZATION
var map = L.map("map", {
}).setView([12.879, 121.774], 6);

// TILELAYER
var openlayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);




// LAYERS
var marker = L.marker([12.879, 121.774]).addTo(map);
var latlngs = [
  [12.879, 121.774],
  [14.599, 120.984],
];

var line = L.polyline(latlngs, { color: "red", weight: 3 }).addTo(map);

// EVENTS
map.on("click", function (e) {
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;
  console.log("Latitude: " + lat + ", Longitude: " + lng);
});

map.fitBounds(line.getBounds());

// LOAD GEOJSON


