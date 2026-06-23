require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/widgets/Expand",
  "esri/widgets/BasemapGallery",
  "esri/widgets/ScaleBar",
  "esri/views/SceneView",
], (
  Map,
  MapView,
  FeatureLayer,
  Legend,
  LayerList,
  Expand,
  BasemapGallery,
  ScaleBar,
  SceneView,
) => {
  // MAP
  const map = new Map({
    basemap: "gray-vector",
    ground: "world-elevation",
  });

  const view = new MapView({
    container: "map",
    map: map,
    center: [144.946457, -37.840935],
    zoom: 15,
  });

  // const view = new SceneView({
  //   container: "map",
  //   map: map,
  //   center: [144.946457, -37.840935],
  //   zoom: 15,
  //   camera: {
  //     position: [144.946457, -37.840935, 2500],
  //     tilt: 65,
  //   },
  // });

  // DATA
  const parcelZone = new FeatureLayer({
    title: "Victoria Land Zone",
    url: "https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/3",
    opacity: 0.8,
  });

  const floodLayer = new FeatureLayer({
    title: "Flood Extent - 1 in 100 Year",
    url: "https://emapdev.ffm.vic.gov.au/arcgis/rest/services/Victorian_Flood_Database/MapServer/14",
    outFields: ["*"],
    opacity: 0.8,
    minScale: 0,
    maxScale: 0,
    popupTemplate: {
      title: "Flood Area",
      content: `
                        <b>ARI:</b> {ARI}<br>
                        <b>Study ARI:</b> {STUDYARI}<br>
                        <b>Method:</b> {METHOD}<br>
                        <b>Reliability:</b> {RELIABILITY}<br>
                        <b>Source:</b> {SOURCE}<br>
                        <b>Area:</b> {AREA_SM} m²<br><br>
                        <b>Decision  idea:</b><br>
                        The flood layer overlaps the parcels, mark it as "Needs deeper analysis" or "High risk".
                    `,
    },
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [40, 120, 255, 0.6],
        outline: {
          color: [0, 70, 180, 0.8],
          width: 1,
        },
      },
    },
  });

  const zonesLayer = new FeatureLayer({
    title: "Planning Zones",
    url: "https://plan-gis.mapshare.vic.gov.au/arcgis/rest/services/Planning/Vicplan_PlanningSchemeZones/MapServer/0",
    outFields: ["*"],
    opacity: 0,
    labelsVisible: false,
    legendEnabled: false,
    popupTemplate: {
      title: "Zone: {ZONE_CODE}",
      content: `
                        <b>Zone:</b> {ZONE_CODE}<br>
                        <b>Description:</b> {ZONE_DESCRIPTION}<br>
                        <b>Group:</b> {ZONE_CODE_GROUP_LABEL}<br>
                        <b>LGA:</b> {LGA}<br>
                        <b>Scheme:</b> {SCHEME_CODE}
                    `,
    },
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [255, 190, 0, 0.35],
        outline: {
          color: [180, 120, 0, 0.8],
          width: 0.5,
        },
      },
    },
  });

  const parcelsLayer = new FeatureLayer({
    title: "Victoria Land Plan",
    url: "https://plan-gis.mapshare.vic.gov.au/arcgis/rest/services/Planning/VicPlan_PropertyAndParcel/MapServer/4",
    outFields: ["*"],
    minScale: 8000,
    labelingInfo: [
      {
        labelExpressionInfo: {
          expression: "$feature.PARCEL_SPI",
        },
        symbol: {
          type: "text",
          color: "black",
          haloColor: "white",
          haloSize: "1px",
          font: {
            size: 10,
            family: "Arial",
            weight: "bold",
          },
        },
        labelPlacement: "center-center",
        minScale: 2000,
        maxScale: 0,
      },
    ],
    popupTemplate: {
      title: "Parcel: {PARCEL_SPI}",
      content: `
                        <b>Parcel SPI:</b> {PARCEL_SPI}<br>
                        <b>Parcel ID:</b> {PARCEL_ID}<br>
                        <b>Lot number:</b> {PARCEL_LOT_NUMBER}<br>
                        <b>Plan number:</b> {PARCEL_PLAN_NUMBER}<br>
                        <b>LGA code:</b> {PARCEL_LGA_CODE}<br>
                        <b>Area:</b> {Shape_Area} m²<br><br>
                    `,
    },
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [30, 30, 30, 0.9],
          width: 0.8,
        },
      },
    },
  });

  map.addMany([parcelZone, zonesLayer, floodLayer, parcelsLayer]);

  // Click Events
  let parcelsView;
  let highlight;
  let floodView;

  let zoneAttributes = null;
  view.whenLayerView(parcelsLayer).then((lv) => {
    parcelsView = lv;
  });

  view.on("click", async function (event) {
    view.popup.watch("visible", (visible) => {
      if (!visible && highlight) {
        try {
          highlight.remove();
        } catch (e) {
          console.warn("Highlight already removed");
        }
        highlight = null;
      }
    });

    const hit = await view.hitTest(event);

    const parcelHit = hit.results.find(function (result) {
      return result.graphic.layer === parcelsLayer;
    });

    if (!parcelHit) {
      return;
    }

    const parcelGraphic = parcelHit.graphic;
    const parcelAttributes = parcelGraphic.attributes;
    const parcelGeometry = parcelGraphic.geometry;

    // -------------------------------
    // ZONE QUERY (FIXED ORDER)
    // -------------------------------
    const zoneQuery = zonesLayer.createQuery();
    zoneQuery.geometry = parcelGeometry;
    zoneQuery.spatialRelationship = "intersects";
    zoneQuery.returnGeometry = false;
    zoneQuery.outFields = ["*"];

    const zoneResult = await zonesLayer.queryFeatures(zoneQuery);

    let zoneAttributes = null;

    if (zoneResult.features.length > 0) {
      zoneAttributes = zoneResult.features[0].attributes;
    }

    // -------------------------------
    // HIGHLIGHT
    // -------------------------------
    if (highlight) {
      highlight.remove();
    }

    highlight = parcelsView.highlight(parcelGraphic);

    view.whenLayerView(floodLayer).then((lv) => {
      floodView = lv;
    });

    // -------------------------------
    // FLOOD QUERY
    // -------------------------------
    const floodQuery = floodLayer.createQuery();
    floodQuery.geometry = parcelGeometry;
    floodQuery.spatialRelationship = "intersects";
    floodQuery.returnGeometry = false;
    floodQuery.outFields = ["*"];
    floodQuery.where = "1=1";

    const floodResult = await floodLayer.queryFeatures(floodQuery);

    let hasFloodRisk = false;

    if (floodResult.features.length > 0) {
      hasFloodRisk = true;
    }

    let decision = "SAFE";

    if (hasFloodRisk === true) {
      decision = "NEEDS DEEPER ANALYSIS";
    }

    // -------------------------------
    // POPUP (UPDATED WITH ZONE)
    // -------------------------------
    view.popup.open({
      title: "Parcel Decision: " + parcelAttributes.PARCEL_SPI,
      location: event.mapPoint,
      content:
        "<b>Parcel SPI:</b> " +
        parcelAttributes.PARCEL_SPI +
        "<br>" +
        "<b>Lot number:</b> " +
        parcelAttributes.PARCEL_LOT_NUMBER +
        "<br>" +
        "<b>Plan number:</b> " +
        parcelAttributes.PARCEL_PLAN_NUMBER +
        "<br>" +
        "<b>Area:</b> " +
        parcelAttributes.Shape_Area +
        " m²<br><br>" +
        "<b>Zone Code:</b> " +
        (zoneAttributes ? zoneAttributes.ZONE_CODE : "N/A") +
        "<br>" +
        "<b>Zone Desc:</b> " +
        (zoneAttributes ? zoneAttributes.ZONE_DESCRIPTION : "N/A") +
        "<br><br>" +
        "<b>Decision:</b> " +
        decision,
    });
  });

  // WIDGETS
  const legend = new Legend({
    view: view,
  });

  const legendExpand = new Expand({
    view: view,
    content: legend,
    expanded: false,
  });

  const layerList = new LayerList({
    view: view,
  });

  const layerListExpand = new Expand({
    view: view,
    content: layerList,
    expanded: false,
  });

  const baseMapGallery = new BasemapGallery({
    view: view,
  });

  const baseMapGalleryExpand = new Expand({
    view: view,
    content: baseMapGallery,
    expanded: false,
  });

  const scaleBar = new ScaleBar({
    view: view,
  });

  view.ui.move("zoom", "top-right");
  view.ui.add(legendExpand, "top-right");
  view.ui.add(layerListExpand, "top-right");
  view.ui.add(baseMapGalleryExpand, "top-right");
  view.ui.add(scaleBar, "bottom-right");
});