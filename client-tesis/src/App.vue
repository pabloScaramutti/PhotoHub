<template>
  <v-app id="inspire">
    <div>
      <NavBar v-if="this.$router.currentRoute.name != 'Login'"/>
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

  created: function () {
    // `this` hace referencia a la instancia vm
    console.log(this.$router.currentRoute);
  },

  data: () => ({
    //
  })
};
</script>
