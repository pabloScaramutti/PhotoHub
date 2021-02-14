<template>
  <v-bottom-navigation
    :value="activo"
    app
    background-color="negro"
    color="primary"
    dark
    class="bottom-bar"
  >
    <v-btn :to="{ name: 'Home' }">
      <v-icon>home</v-icon>
    </v-btn>

    <v-btn>
      <v-icon>search</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'NuevaCarpeta' }">
      <v-icon>create_new_folder</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'Notas' }">
      <v-icon>description</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'Calendario' }">
      <v-icon>today</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomBar",
  data() {
    return {
      activo: undefined,
    };
  },
  created: function () {
    if (this.$router.currentRoute.name == "/") {
      this.activo = 0;
    }
  },
};
</script>

<style scoped>
.v-item-group.v-bottom-navigation .v-btn {
  min-width: 73px;
}
</style>
