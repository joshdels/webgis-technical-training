import { cities } from "../data/cities.js";

//Main solution
// FOR LOOP
for (let i = 0; i < cities.length; i++) {
  // CONDITIONS + ARRAY OBJECT ACCESS
  if (cities[i].name === "Baguio City") {
    console.log(cities[i].name);
  }
}


// Solution 2
cities.forEach((city) => {
  if (city.name === "Baguio City") {
    console.log(city.name);
  }
});


// Solution 3
const result = cities.filter((city) => city.name === "Baguio City");
console.log(result[0].name);
