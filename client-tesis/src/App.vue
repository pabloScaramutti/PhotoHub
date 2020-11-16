<template>
  <v-app id="inspire">
    <div>
      <NavBar v-if="muestroLayout()" />
    </div>
    <v-main>
      <router-view />
    </v-main>

    <v-btn
      :to="{ name: 'Notificaciones', params: { notificaciones: noLeidos } }"
      v-if="muestroLayout()"
      class="floating-button"
      fab
      color="primary"
    >
      <v-badge
        color="error"
        :value="noLeidos.length"
        :content="noLeidos.length"
      >
        <v-icon> camera_alt </v-icon>
      </v-badge>
    </v-btn>
    <button v-on:click="sendTest()" id="boton-prueba-mandar">Mandar</button>
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
      algunaCosa: String,
      noLeidos: [],
    };
  },

  created() {
    this.socket = io.connect("http://192.168.0.123:3000");
  },

  mounted() {
    this.socket.on("bienvenida", (data) => {
      this.algunaCosa = data;
    });
    this.socket.on("recibido", (data) => {
      this.noLeidos.push(data);
      //console.log(this.noLeidos);
    });
    this.socket.on("nuevaFoto", (data) => {
      this.noLeidos.push(data);
      console.log("Recibi una nueva foto", data);
    });
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
    sendTest() {
      this.socket.emit("test", 123);
      //console.log("envio test");
    },
  },

  /*data: () => ({
    //
  })*/
};
</script>

<style scoped>
.floating-button {
  z-index: 2;
  position: fixed;
  bottom: 10vh;
  right: 5vw;
}

#boton-prueba-mandar {
  position: fixed;
  bottom: 7vh;
  right: 5vw;
}

@media (max-width: 700px) and (orientation: landscape) {
  #boton-prueba-mandar {
    bottom: 15vh;
  }
  .floating-button {
    bottom: 20vh;
  }
}
</style>
