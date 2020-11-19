<template>
  <l-map ref="myMap" :zoom="zoom" :center="center">
    <l-tile-layer :url="url"> </l-tile-layer>
    <l-marker :lat-lng="marker"></l-marker>
  </l-map>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "Mapa",
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },

  data: () => {
    return {
      zoom: 6,
      center: L.latLng(-34.920954, -57.954425),
      marker: L.latLng(-34.920954, -57.954425),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    };
  },

  /*mounted() {
    this.$nextTick(() => {
      this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
    });
  },*/
};
</script>

<style>
</style>
