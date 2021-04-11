<template>
  <div class="mapa">
    <div class="location">
      <v-icon>location_on</v-icon>
      {{
        ubicacion != ""
          ? `${ubicacion.localidad}, ${ubicacion.ciudad}, ${ubicacion.provincia}, ${ubicacion.pais}`
          : "No hay una ubicacion guardada"
      }}
    </div>
    <l-map
      ref="myMap"
      :zoom="zoom"
      :center="center"
      @click="editMarker && setMarker($event)"
    >
      <l-tile-layer :url="url"> </l-tile-layer>
      <l-marker v-if="marker" :lat-lng="marker"></l-marker>
      <l-control>
        <v-icon
          v-if="!editMarker"
          @click="editMarker = true"
          class="control-btn"
        >
          edit
        </v-icon>
        <v-icon v-if="editMarker" @click="editConfirm()" class="control-btn">
          done
        </v-icon>
        <v-icon v-if="editMarker" @click="cancelEdit()" class="control-btn">
          clear
        </v-icon>
      </l-control>
      <v-geosearch :options="geosearchOptions"></v-geosearch>
    </l-map>
  </div>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LControl } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/vgeosearch.css";
import Axios from "axios";

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
    img: undefined,
    lat: {
      type: String,
      default: "",
    },
    long: {
      type: String,
      default: "",
    },
  },

  data: () => {
    return {
      zoom: 6,
      center: undefined,
      marker: undefined,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      editMarker: false,
      ubicacion: "",
      coordenadas: { lat: "", long: "" },
      coordenadasTemp: { lat: "", long: "" },

      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
      },
    };
  },

  created() {
    console.log(this.lat, this.lng);
    if (this.procesarCoordenadas()) {
      this.center = L.latLng(this.coordenadas.lat, this.coordenadas.lng);
      this.marker = L.latLng(this.coordenadas.lat, this.coordenadas.lng);
      this.getReverseGeocode(this.coordenadas.lat, this.coordenadas.lng);
    } else {
      this.getGeolocation();
      console.log("Ubicacion por dispositivo sin marcador");
    }
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
      this.coordenadasTemp = e.latlng;
      this.getReverseGeocode(
        this.coordenadasTemp.lat,
        this.coordenadasTemp.lng
      );
      //this.$emit("changeLocation", e.latlng);
    },

    async getReverseGeocode(lat, lng) {
      // Axios.get(`https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lng}&zoom=18&format=jsonv2`
      // ).then((r) => {this.ubicacion = r.data.display_name; }).catch((e) => console.log(e));

      Axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=es`
      ).then((r) => {
        console.log(r);
        this.ubicacion = {
          localidad: r.data.locality,
          ciudad: r.data.city,
          provincia: r.data.principalSubdivision,
          pais: r.data.countryName,
        };
      });
    },

    cancelEdit() {
      this.editMarker = false;
      if (this.coordenadas.lat != "" && this.coordenadas.lng != "") {
        this.getReverseGeocode(this.coordenadas.lat, this.coordenadas.lng);
        this.marker = this.coordenadas;
      } else {
        this.ubicacion = "";
        this.marker = undefined;
      }
      this.coordenadasTemp = this.coordenadas;
    },

    editConfirm() {
      this.editMarker = false;
      this.coordenadas = this.coordenadasTemp;

      this.img.exif.GPSLatitude = `${
        this.coordenadas.lat < 0
          ? (this.coordenadas.lat * -1).toString() + " S"
          : this.coordenadas.lat.toString() + " N"
      }`;

      this.img.exif.GPSLongitude = `${
        this.coordenadas.lng < 0
          ? (this.coordenadas.lng * -1).toString() + " W"
          : this.coordenadas.lng.toString() + " E"
      }`;

      this.img.exif.GPSPosition =
        this.img.exif.GPSLatitude + ", " + this.img.exif.GPSLongitude;

      this.$http
        .put(`/fotos/${this.img.id}`, {
          exif: this.img.exif,
        })
        .then((r) => console.log("Se actualizo la foto", r));
    },

    procesarCoordenadas() {
      if (this.lat === "" && this.long === "") return undefined;
      this.coordenadas.lat = this.getImgLat();
      this.coordenadas.lng = this.getImgLong();
      return true;
    },

    getImgLat() {
      let lat = this.lat.split(" ");
      lat[1] == "S" ? (lat[0] *= -1) : "";
      return lat[0];
    },

    getImgLong() {
      let long = this.long.split(" ");
      long[1] == "W" ? (long[0] *= -1) : "";
      return long[0];
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

.location {
  margin: 0 1vh 2vh 1vh;
}

.mapa {
  width: 100%;
  height: 100%;
}
</style>
