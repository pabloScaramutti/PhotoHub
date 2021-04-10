<template>
  <l-map
    ref="myMap"
    :zoom="zoom"
    :center="center"
    @click="editMarker && setMarker($event)"
  >
    <l-tile-layer :url="url"> </l-tile-layer>
    <l-marker v-if="marker" :lat-lng="marker"></l-marker>
    <v-geosearch :options="geosearchOptions"></v-geosearch>

    <v-marker-cluster v-if="markers">
      <l-marker
        v-for="(m, i) in markers"
        :key="i"
        :lat-lng="convertToLatLong(m)"
      >
        <!-- <v-popup :content="c.tooltipContent"></v-popup> -->
      </l-marker>
    </v-marker-cluster>
  </l-map>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/vgeosearch.css";

//geoserch
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";

//markercluster
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

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
    VGeosearch,
    "v-marker-cluster": Vue2LeafletMarkerCluster,
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

  props: {
    markers: {
      type: Array,
    },
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

    getImgLat(img) {
      if ("GPSLatitude" in img.exif) {
        let lat = img.exif.GPSLatitude.split(" ");
        lat[1] == "S" ? (lat[0] *= -1) : "";
        return lat[0];
      } else {
        return undefined;
      }
    },
    getImgLong(img) {
      if ("GPSLongitude" in img.exif) {
        let long = img.exif.GPSLongitude.split(" ");
        long[1] == "W" ? (long[0] *= -1) : "";
        return long[0];
      } else {
        return undefined;
      }
    },

    convertToLatLong(unaImagen) {
      return L.latLng(this.getImgLat(unaImagen), this.getImgLong(unaImagen));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

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
