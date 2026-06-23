// FETCH - THEN
// fetch("https://psgc.gitlab.io/api/regions/")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// AWAIT - ASYNC
// async function fetchRegions() {
//   const response = await fetch("https://psgc.gitlab.io/api/regions/");
//   const data = await response.json();
//   console.log(data);
// }

// fetchRegions();

// FETCH BOUNDARIES
// let datas = "";

fetch(
  "https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/2023/geojson/country/lowres/country.0.001.json",
)
  .then((response) => response.json())
  .then((data) => {
    datas = data;
    console.log(datas);

    for (let i = 0; i < datas.features.length; i++) {
      const name = datas.features[i].properties.adm1_en;
      console.log(name);
    }
  })
  .catch((error) => {
    console.error;
  });
