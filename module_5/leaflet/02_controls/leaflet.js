// MAP INITIALIZATION
var map = L.map("map", {
  zoomControl: false,
  attributionControl: false,
}).setView([12.879, 121.774], 6);

// TILELAYER
var openlayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

var darklayer = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "png",
  },
);

// LAYERS
var marker = L.marker([12.879, 121.774]).addTo(map);
var latlngs = [
  [12.879, 121.774],
  [14.599, 120.984],
];

var line = L.polyline(latlngs, { color: "red", weight: 3 }).addTo(map);

//  GROUP LAYERS
var baseMaps = { "Open Layer": openlayer, "Dark Layer": darklayer };
var layers = { Marker: marker, Line: line };




// ADVANCE STUFFS MAP CONTROLS
// ZOOM
L.control
  .zoom({
    position: "topright",
  })
  .addTo(map);

// SCALE
L.control
  .scale({
    position: "bottomleft",
    metric: true,
    imperial: false,
    maxWidth: 200,
  })
  .addTo(map);

// ATTRIBUTES
L.control
  .attribution({
    position: "bottomright",
    prefix: "Joshua De Leon",
    removeAttribution: true,
  })
  .addTo(map);

//LAYERS
L.control
  .layers(baseMaps, layers, {
    position: "bottomright",
  })
  .addTo(map);


  