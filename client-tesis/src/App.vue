<template>
  <v-app id="inspire">
    <div>
      <NavBar />
    </div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./views/Layout/NavBar";

export default {
  name: "App",

  components: {
    NavBar
  },

  data: () => ({
    //
  })
};
</script>
