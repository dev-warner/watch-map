<script>
  import { onMount } from "svelte";
  import { selected, data } from "../state/goods.state.js";

  export let hover;

  let toHover;
  let polygonSeries;

  function setMap(data) {
    if (!data.length) return;

    const chart = am4core.create("map", am4maps.MapChart);

    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;

    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();
    chart.maxZoomLevel = 1;

    polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    polygonSeries.useGeodata = true;

    const polygonTemplate = polygonSeries.mapPolygons.template;

    polygonTemplate.tooltipText = "{name}: {currency}";
    polygonTemplate.fill = am4core.color("#ccc");

    const hs = polygonTemplate.states.create("hover");

    hs.properties.fill = am4core.color("red");
    polygonSeries.exclude = ["AQ"];
    polygonSeries.data = data;
    polygonSeries.calculateVisualCenter = true;
    polygonSeries.mapPolygons.template.tooltipPosition = "fixed";

    polygonTemplate.propertyFields.fill = "fill";
  }

  data.subscribe(data => {
    try {
      setMap(data);
    } catch (e) {}
  });

  $: {
    try {
      if (polygonSeries && hover) {
        toHover && (toHover.isHover = false);
        toHover = polygonSeries.getPolygonById(hover);
        toHover.isHover = true;
      }

      if (!hover && toHover) {
        toHover.isHover = false;
      }
    } catch (err) {}
  }
</script>

<style>
  .map {
    height: 100%;
    min-height: 300px;
    width: 100%;
  }
</style>

<div id="map" class="map" />
