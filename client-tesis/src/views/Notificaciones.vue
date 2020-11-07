<template>
  <div class="notificaciones">
    <h1>Notificaciones</h1>
    <GrillaFotos v-if="notificaciones" :imagenes="imagenes"></GrillaFotos>
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_masonry";

export default {
  name: "Notificaciones",
  data() {
    return {
      notificaciones: this.$route.params.notificaciones,
      imagenes: this.$route.params.notificaciones.map(
        item => `http://192.168.0.123:1337${item.img.url}`
      )
    };
  },
  components: {
    GrillaFotos
  }
};
</script>

<style lang="scss" scoped>
.notificaciones {
  padding: 1vw;
}
</style>
