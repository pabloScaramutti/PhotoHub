<template>
  <div class="home">
    <!-- <SlideFotos :imagenes="imagenes" titulo="Nombre del album"></SlideFotos> -->
    <!-- <FotoLista :img="imagenes[0]"> </FotoLista> -->
    <CalendarioSlider />
    <GrillaFotos :imagenes="imagenes" style="width: 100%"></GrillaFotos>
    <Mapa class="mapa"> </Mapa>
    <router-link :to="{ name: 'Login' }">
      <v-btn block rounded color="primary"> Login </v-btn>
    </router-link>
    <div v-for="(carpeta, i) in carpetas" :key="i">
      <SlideFotos v-if="carpeta.fotos.length > 0" :carpeta="carpeta" />
    </div>
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_justifiedLayout";
import SlideFotos from "@/components/SlideFotos";
import Mapa from "@/components/Mapa_markercluster";
import CalendarioSlider from "@/components/CalendarioSlider";
// import FotoLista from "@/components/Foto_Lista";

export default {
  name: "Home",
  components: {
    GrillaFotos,
    SlideFotos,
    Mapa,
    CalendarioSlider,
    // FotoLista,
  },
  data() {
    return {
      imagenes: undefined,
      cadena: undefined,
      carpetas: undefined,
    };
  },

  mounted() {
    this.$http
      .get("/fotos?_sort=created_at:DESC")
      .then((response) => {
        this.imagenes = response.data;
      })
      .catch((error) => {
        console.log("Error al cargar las imagenes", error);
      });

    this.$http
      .get("/carpetas")
      .then((r) => (this.carpetas = r.data))
      .catch((e) => console.log("Error al cargar las carpetas", e));
  },
};
</script>

<style lang="scss" scoped>
.mapa {
  width: 100%;
  height: 50vh;
}
</style>
