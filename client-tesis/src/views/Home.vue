<template>
  <div class="home">
    <!-- <SlideFotos :imagenes="imagenes" titulo="Nombre del album"></SlideFotos> -->
    <!-- <FotoLista :img="imagenes[0]"> </FotoLista> -->
    <GrillaFotos :imagenes="imagenes"></GrillaFotos>
    <Mapa class="mapa"> </Mapa>
    <router-link :to="{ name: 'Login' }">
      <v-btn block rounded color="primary"> Login </v-btn>
    </router-link>
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_justifiedLayout";
// import SlideFotos from "@/components/SlideFotos";
import Mapa from "@/components/Mapa";
// import FotoLista from "@/components/Foto_Lista";

export default {
  name: "Home",
  components: {
    GrillaFotos,
    // SlideFotos,
    Mapa,
    // FotoLista,
  },
  data() {
    return {
      imagenes: undefined,
      cadena: undefined,
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
  },
};
</script>

<style lang="scss" scoped>
.mapa {
  width: 100%;
  height: 50vh;
}
</style>
