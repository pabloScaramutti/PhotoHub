<template>
  <v-app id="inspire">
    <p>{{ this.algunaCosa }}</p>
    <button v-on:click="sendTest()">Mandar</button>
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

import io from "socket.io-client";

export default {
  name: "App",

  data() {
    return {
      socket: {},
      algunaCosa: String
    };
  },

  created() {
    this.socket = io.connect("http://192.168.0.123:3000");
  },

  mounted() {
    this.socket.on("bienvenida", data => {
      this.algunaCosa = data;
    });
    this.socket.on("recibido", data => {
      console.log(data);
    });
  },

  components: {
    NavBar,
    BottomBar
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
    sendTest() {
      this.socket.emit("test", 123);
      console.log("envio test");
    }
  }

  /*data: () => ({
    //
  })*/
};
</script>
