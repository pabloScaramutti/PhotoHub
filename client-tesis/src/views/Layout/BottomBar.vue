<template>
  <v-bottom-navigation app background-color="negro" color="primary" dark>
    <v-btn>
      <v-icon>home</v-icon>
    </v-btn>

    <v-btn>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn>
      <v-icon>create_new_folder</v-icon>
    </v-btn>

    <v-btn>
      <v-icon>note_add</v-icon>
    </v-btn>

    <v-btn>
      <v-icon>today</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomBar"
};
</script>

<style scoped>

.v-item-group.v-bottom-navigation .v-btn {
  min-width: 73px;
} 

</style>
