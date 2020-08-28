<template>
  <v-app id="inspire">
    <div>
      <NavBar v-if="muestroNavBar()" />
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

  created: function() {
    // `this` hace referencia a la instancia vm
    console.log(this.$router.currentRoute);
  },

  methods: {
    muestroNavBar() {
      switch (this.$router.currentRoute.name) {
        case "Login":
          return false;
        case "Registro":
          return false;
        default:
          return true;
      }
    }
  },

  data: () => ({
    //
  })
};
</script>
