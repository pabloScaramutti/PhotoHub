<template>
  <div>
    <v-app-bar app color="negro" dark height="45rem">
      <!-- <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </div>

      <v-spacer></v-spacer>

      <router-link class="link" :to="{}">
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar> -->

      <div class="navBar-icons">
        <div>
          <v-icon v-if="showBack" @click="$router.go(-1)"
            >keyboard_backspace</v-icon
          >
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
        </div>
        <router-link :to="{ name: 'Home' }">
          <v-img
            alt="Logo"
            class="logo"
            contain
            src="@/assets/logo-tesis.png"
            transition="scale-transition"
            width="39"
            height="39"
          />
        </router-link>
        <div @click="cleanNotifications()" class="pointer">
          <v-badge
            color="error"
            :value="noLeidos.length"
            :content="noLeidos.length"
            overlap
          >
            <v-icon> camera_alt </v-icon>
          </v-badge>
        </div>
      </div>
    </v-app-bar>

    <button v-on:click="sendTest()" id="boton-prueba-mandar">Mandar</button>

    <!------------------------------------------------------------------->

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      color="negro"
      class="drawer"
    >
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        style="margin: 8px 20px"
      ></v-app-bar-nav-icon>
      <router-link :to="{ name: 'Home' }">
        <v-img src="@/assets/logo-tesis.png" class="logo-drawer"></v-img>
      </router-link>
      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: "Home", icon: "dashboard" },
        { title: "About", icon: "question_answer" },
      ],

      socket: {},
      algunaCosa: String,
      noLeidos: [],
      showBack: this.checkRoute(),
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

  watch: {
    $route() {
      this.showBack = this.checkRoute();
    },
  },

  methods: {
    sendTest() {
      this.socket.emit("test", 123);
      //console.log("envio test");
    },
    checkRoute() {
      return this.$router.currentRoute.name != "Home";
    },
    cleanNotifications() {
      if (this.$router.currentRoute.name != "Notificaciones") {
        this.noLeidos = [];
        this.$router.push({ name: "Notificaciones" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.link {
  text-decoration: none;
}

.pointer {
  cursor: pointer;
}

.logo {
  margin: 0.3vh;
}

.logo-drawer {
  margin: 0rem auto 1rem;
  width: 50%;
}

.navBar-icons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// esto borrar cuando saque el boton prueba madnar-----
#boton-prueba-mandar {
  z-index: 5;
  position: fixed;
  bottom: 7vh;
  right: 5vw;
}

@media (max-width: 700px) and (orientation: landscape) {
  #boton-prueba-mandar {
    bottom: 15vh;
  }
}
//-----hasta aca--------
</style>
