<template>
  <div class="home">
    <SlideFotos :imagenes="imagenes" titulo="Nombre del album"></SlideFotos>
    <GrillaFotos :imagenes="imagenes"></GrillaFotos>
    <router-link :to="{ name: 'Login' }">
      <v-btn block rounded color="primary"> Login </v-btn>
    </router-link>
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_masonry";
import SlideFotos from "@/components/SlideFotos";

export default {
  name: "Home",
  components: {
    GrillaFotos,
    SlideFotos
  },
  data() {
    return {
      imagenes: [
        require("@/assets/Media/DSC_0615.jpg"),
        require("@/assets/Media/DSC_0171.jpg"),
        require("@/assets/Media/DSC_0288.jpg"),
        require("@/assets/Media/DSC_0294.jpg"),
        require("@/assets/Media/DSC_0338.jpg"),
        require("@/assets/Media/DSC_0342.jpg"),
        require("@/assets/Media/DSC_0353.jpg"),
        require("@/assets/Media/DSC_0362.jpg"),
        require("@/assets/Media/DSC_0370.jpg"),
        require("@/assets/Media/DSC_0373.jpg"),
        require("@/assets/Media/DSC_0374.jpg"),
        require("@/assets/Media/DSC_0380.jpg"),
        require("@/assets/Media/DSC_0397.jpg"),
        require("@/assets/Media/DSC_0423.jpg"),
        require("@/assets/Media/DSC_0449.jpg")
      ],
      cadena: undefined
    };
  }
};
</script>
