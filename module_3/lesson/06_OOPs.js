class City {
  // Properties/Attributes
  constructor(name, lat, lng) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
  }

  // Methods/Behavior
  show() {
    console.log(this.name, this.lat, this.lng);
  }

  move(newLat, newLng) {
    this.lat = newLat;
    this.lng = newLng;
  }

  getCoords() {
    return [this.lat, this.lng];
  }
}

// Invoke
const gensan = new City("General Santos", 6.1164, 125.1716);
gensan.show();

const amerika = new City("Amerika");
console.log(amerika);

// console.log(gensan.getCoords());
// gensan.move(6.1200, 125.1800);
// console.log(gensan.getCoords());
