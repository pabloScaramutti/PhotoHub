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
p {
  font-weight: 100;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-column {
  flex-direction: column;
}

.justify-space-around {
  justify-content: space-around;
}

.justify-space-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}

.margin-auto {
  margin: auto;
}

.loading {
  padding: 30px;
  display: flex;
  margin: auto;
}

.floating-btn {
  z-index: 1;
  position: fixed;
  bottom: 80px;
  right: 25px;
}

.pop-up-alert {
  position: fixed;
  bottom: 10vh;
}

.done-confirm-btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.m-bottom-10 {
  margin-bottom: 10px;
}

.sticky {
  position: sticky;
  top: 45px;
  z-index: 3;
  background-color: #121212;
}

.evitar-seleccion-txt {
  user-select: none;
}

::-webkit-scrollbar {
  width: 5px;
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
