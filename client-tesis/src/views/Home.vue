<template>
  <div class="home">
    <!-- <SlideFotos :imagenes="imagenes" titulo="Nombre del album"></SlideFotos> -->
    <!-- <FotoLista :img="imagenes[0]"> </FotoLista> -->
    <Mapa class="mapa" :markers="imgWithGPS"> </Mapa>
    <div v-for="(carpeta, i) in carpetas" :key="i">
      <SlideFotos v-if="carpeta.fotos.length > 0" :carpeta="carpeta" />
    </div>

    <br />
    <h2 class="ml-30">Recientes</h2>
    <hr />
    <GrillaFotos :imagenes="imagenes" style="width: 100%"></GrillaFotos>

    <router-link :to="{ name: 'Login' }">
      <v-btn block rounded color="primary"> Login </v-btn>
    </router-link>
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_justifiedLayout";
import SlideFotos from "@/components/SlideFotos";
import Mapa from "@/components/Mapa_markercluster";
// import FotoLista from "@/components/Foto_Lista";

export default {
  name: "Home",
  components: {
    GrillaFotos,
    SlideFotos,
    Mapa,
    // FotoLista,
  },
  data() {
    return {
      imagenes: undefined,
      cadena: undefined,
      carpetas: undefined,
      imgWithGPS: undefined,
    };
  },

  mounted() {
    this.$http
      .get("/fotos?_sort=created_at:DESC")
      .then((response) => {
        this.imagenes = response.data;
        this.imgWithGPS = this.getPhotoLocations();
      })
      .catch((error) => {
        console.log("Error al cargar las imagenes", error);
      });

    this.$http
      .get("/carpetas")
      .then((r) => (this.carpetas = r.data))
      .catch((e) => console.log("Error al cargar las carpetas", e));
  },

  methods: {
    getPhotoLocations() {
      if (!this.imagenes) return [];
      return this.imagenes.filter((p) => {
        if (p.exif.GPSPosition) {
          return true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mapa {
  width: 100%;
  height: 50vh;
}

.ml-30 {
  margin-left: 16px;
}
</style>
