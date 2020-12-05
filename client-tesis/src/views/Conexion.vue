<template>
  <div class="conection">
    <div class="settings-buttons">
      <router-link class="router-link" :to="{ name: 'Conexion' }">
        <v-btn fab color="primary">
          <v-icon size="35">wifi</v-icon>
        </v-btn>
        <p>Conectarse con</p>
        <p class="bold">WPS</p>
      </router-link>
    </div>
    <h2>Redes</h2>
    <div v-if="redes" class="networks">
      <div v-for="(red, index) in redes" :key="index">
        <div class="network">
          <v-icon v-if="red.encryptionKey === 'off'" class="icon"
            >signal_wifi_4_bar</v-icon
          >
          <v-icon v-else class="icon">wifi_lock</v-icon>
          <p>{{ red.ESSID }}</p>
        </div>
        <div class="line"></div>
      </div>
    </div>
    <div v-else class="loading">
      <v-progress-circular
        indeterminate
        size="50"
        color="primary"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      redes: undefined,
    };
  },

  created() {
    this.getNetworks();
  },

  methods: {
    getNetworks() {
      this.$http
        .get("/controllers")
        .then((response) => {
          this.redes = response.data;
        })
        .catch((error) => {
          console.log("Ocurrio un error:", error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.conection {
  height: 100%;
  padding: 30px;

  p {
    font-weight: 100;
    margin: 0;
  }

  .networks {
    padding: 10px 20px;

    .network {
      display: flex;
      align-items: center;
      padding: 20px 0px;

      .icon {
        margin-right: 20px;
      }
    }

    .network:hover {
      background-color: #292929;
    }
  }

  .line {
    width: 100%;
    border-bottom: 1px solid #292929;
  }

  .loading {
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .settings-buttons {
    display: flex;
    justify-content: space-evenly;

    .router-link {
      //width: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 20px;
      text-decoration: none;
      color: inherit;

      p {
        margin-top: 5px;
        font-size: 15px;
        line-height: 1.2;
      }

      .bold {
        font-weight: 500;
      }
    }
  }
}
</style>