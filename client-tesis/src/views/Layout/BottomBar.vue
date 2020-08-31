<template>
  <v-bottom-navigation :value="activo" app background-color="negro" color="primary" dark>
    <v-btn :to="{ name: 'Home' }">
      <v-icon>home</v-icon>
    </v-btn>

    <v-btn>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn>
      <v-icon>create_new_folder</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'Nota' }">
      <v-icon>description</v-icon>
    </v-btn>

    <v-btn>
      <v-icon>today</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomBar",
  data() {
    return {
      activo: 0
    }
  },
  mounted: function () {
    if( this.$router.currentRoute.name == "/" ){
      this.activo = 0;
    }
  }
};
</script>

<style scoped>
.v-item-group.v-bottom-navigation .v-btn {
  min-width: 73px;
}
</style>
