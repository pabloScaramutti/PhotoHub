<template>
  <l-map ref="myMap" :zoom="zoom" :center="center">
    <l-tile-layer :url="url"> </l-tile-layer>
    <l-marker v-if="marker" :lat-lng="marker"></l-marker>
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

  props: {
    lat: undefined,
    long: undefined,
  },

  data: () => {
    return {
      zoom: 6,
      center: undefined,
      marker: undefined,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    };
  },

  created() {
    if (this.lat && this.long) {
      this.center = L.latLng(this.lat, this.long);
      this.marker = L.latLng(this.lat, this.long);
    } else {
      //this.getGeolocation();
      console.log("Ubicacion por dispositivo sin marcador");
    }
  },

  methods: {
    getGeolocation() {
      navigator.geolocation.getCurrentPosition(function (location) {
        console.log(location.coords.latitude);
        console.log(location.coords.longitude);
        console.log(location.coords.accuracy);
      });
    },
  },
};
</script>

<style>
.leaflet-pane {
  z-index: 1;
}

.leaflet-top,
.leaflet-bottom {
  z-index: 2;
}
</style>
