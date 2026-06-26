var map = L.map("map").setView([12.879, 121.774], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

function handleFeatures(feature) {
  const deedValue = feature.properties.deed;
  let chosenColor;

  if (deedValue === "government") {
    chosenColor = "green";
  } else if (deedValue === "deed of sale") {
    chosenColor = "blue";
  } else if (deedValue === "busines") {
    chosenColor = "red";
  } else {
    chosenColor = "gray";
  }

  return {
    fillColor: chosenColor,
    weight: 1,
    opacity: 1,
    color: "black",
    fillOpacity: 0.6,
  };
}

function handlePopups(feature, layer) {
  if (feature.properties) {
    let content = "";

    for (const key in feature.properties) {
      if (feature.properties.hasOwnProperty(key)) {
        content += `<b>${key}:</b> ${feature.properties[key]}<br>`;
      }
    }

    layer.bindPopup(
      `<div style="font-family: monospace; font-size: 12px; line-height: 1.4;">${content}</div>`,
    );
  }
}

function handleCounts(data) {
  let counts = {
    government: 0,
    "deed of sale": 0,
    busines: 0,
    abandoned: 0,
  };

  for (let i = 0; i < data.features.length; i++) {
    const deed = data.features[i].properties.deed;

    if (counts[deed] !== undefined) {
      counts[deed]++;
    }
  }

  return counts;
}

function handleChart(canvasId, countData) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  if (!ctx) {
    return;
  }

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Government", "Deed of Sale", "Business", "Abandoned"],
      datasets: [
        {
          label: "Land Parcels Deeds",
          data: [
            countData["government"],
            countData["deed of sale"],
            countData["busines"],
            countData["abandoned"],
          ],
          backgroundColor: ["green", "blue", "red", "gray"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      cutout: "50%",
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Land Parcel Management",
          font: {
            size: 25,
            weight: "bold",
          },
        },
      },
    },
  });
}

// CODE STARTS HERE 
fetch("") // 1. File Path of GEOJSON??? HINT: "data folder"

  .then((response) => response.json())
  .then((data) => {


    // Layer using geoJSON
    var landParcels = L.geoJSON(data, {
      // 2. ADD STYLING????
      // 5. BONUS - 
    }).addTo(map);

    //3. Invoke the count??

    //4. Initilize the Chart

    // Accessories
    map.flyToBounds(landParcels.getBounds(), {
      padding: [10, 10],
      duration: 2,
    });
  })
  .catch((err) => {
    console.error(err);
  });
