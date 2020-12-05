<template>
  <v-app id="inspire">
    <div>
      <NavBar v-if="muestroLayout()" />
    </div>
    <v-main>
      <router-view />
    </v-main>
    <div>
      <BottomBar v-if="muestroLayout()" />
    </div>
  </v-app>
</template>

<script>
import NavBar from "./views/Layout/NavBar";
import BottomBar from "./views/Layout/BottomBar";

export default {
  name: "App",

  data() {
    return {};
  },

  components: {
    NavBar,
    BottomBar,
  },

  methods: {
    muestroLayout() {
      switch (this.$router.currentRoute.name) {
        case "Login":
          return false;
        case "Registro":
          return false;
        default:
          return true;
      }
    },
  },

  /*data: () => ({
    //
  })*/
};
</script>

<style >
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  border: none;
  overflow: visible;
}

::-webkit-scrollbar-track {
  background: #141519;
}

::-webkit-scrollbar-thumb {
  background: #4e4e4e;
}
</style>
