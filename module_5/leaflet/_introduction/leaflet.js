// MAP INITIALIZATION
var map = L.map("map").setView([12.879, 121.774], 6);

// TILELAYER
var openlayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
