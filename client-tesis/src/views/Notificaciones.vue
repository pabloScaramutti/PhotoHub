<template>
  <div class="notificaciones">
    <h1>Notificaciones</h1>
    <GrillaFotos
      v-if="imagenes"
      :imagenes="imagenes.slice().reverse()"
    ></GrillaFotos>
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_masonry";

export default {
  name: "Notificaciones",
  data() {
    return {
      notificaciones: this.$route.params.notificaciones,
      imagenes: undefined,
    };
  },
  mounted() {
    if (this.$route.params.notificaciones) {
      this.imagenes = this.$route.params.notificaciones.map(
        (item) => `http://192.168.0.123:1337${item.thumbnail.url}`
      );
    }
  },
  components: {
    GrillaFotos,
  },
};
</script>

<style lang="scss" scoped>
.notificaciones {
  padding: 1vw;
}
</style>
