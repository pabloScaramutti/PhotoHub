<template>
  <l-map
    ref="myMap"
    :zoom="zoom"
    :center="center"
    @click="editMarker && setMarker($event)"
  >
    <l-tile-layer :url="url"> </l-tile-layer>
    <l-marker v-if="marker" :lat-lng="marker"></l-marker>
    <l-control>
      <v-icon @click="editMarker = !editMarker" class="control-btn">
        {{ editMarker ? "done" : "edit" }}
      </v-icon>
      <v-icon
        v-if="editMarker"
        @click="editMarker = !editMarker"
        class="control-btn"
      >
        clear
      </v-icon>
    </l-control>
    <v-geosearch :options="geosearchOptions"></v-geosearch>
  </l-map>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LControl } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/vgeosearch.css";

//geoserch
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";

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
    LControl,
    VGeosearch,
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
      editMarker: false,

      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
      },
    };
  },

  created() {
    if (this.lat && this.long) {
      this.center = L.latLng(this.lat, this.long);
      this.marker = L.latLng(this.lat, this.long);
    } else {
      this.getGeolocation();
      console.log("Ubicacion por dispositivo sin marcador");
    }
  },

  watch: {
    lat: function (n) {
      if (n) {
        let nuevaCoordenada = L.latLng(this.lat, this.center.lng);
        this.center = nuevaCoordenada;
        console.log(nuevaCoordenada);
        this.setMarker(nuevaCoordenada);
      } else {
        this.marker = undefined;
      }
    },
    long: function (n) {
      if (n) {
        let nuevaCoordenada = L.latLng(this.center.lat, this.long);
        this.center = nuevaCoordenada;
        this.setMarker(nuevaCoordenada);
      } else {
        this.marker = undefined;
      }
    },
  },

  methods: {
    getGeolocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((location) => {
          this.center = L.latLng(
            location.coords.latitude,
            location.coords.longitude
          );
        });
      } else {
        console.log("La geolocalización no esta disponible en este navegador");
      }
    },

    setMarker(e) {
      console.log(e);
      this.marker = e.latlng;
      this.$emit("changeLocation", e.latlng);
    },
  },
};
</script>

<style lang="scss" scoped>
.leaflet-pane {
  z-index: 1;
}

.leaflet-top,
.leaflet-bottom {
  z-index: 2;
}

.control-btn {
  background-color: white;
  border: 2px solid lightgray;
  padding: 10px;
  border-radius: 50%;
  color: #00b7ff;
}

.color-black {
  color: black !important;
}
</style>
