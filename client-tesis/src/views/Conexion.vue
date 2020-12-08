<template>
  <div class="conection">
    <div class="settings-buttons" @click="activateWPS()">
      <v-btn fab color="primary">
        <v-icon size="35">wifi</v-icon>
      </v-btn>
      <p>Conectarse con</p>
      <p class="bold">WPS</p>
    </div>
    <h2>Redes</h2>
    <div v-if="redes" class="networks">
      <div
        v-for="(red, index) in redes"
        :key="index"
        @click.stop="conectTo(red)"
      >
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

    <!-- Dialogo -->
    <v-dialog v-if="selectedNet" v-model="dialog" width="500">
      <div class="dialog">
        <h3>Conectarse a {{ selectedNet.ESSID }}</h3>
        <v-text-field
          ref="passordInput"
          label="Contraseña"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
        <v-btn fab color="primary" small class="dialog-button"
          ><v-icon>send</v-icon></v-btn
        >
      </div>
    </v-dialog>

    <!-- Dialogo WPS -->
    <v-dialog v-model="dialogWPS" width="500">
      <div class="dialogWPS">
        <h3>Conectarse por WPS</h3>
        <p>Active el WPS en la cámara</p>
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <v-btn @click="dialogWPS = false" class="mt-10">Cancelar</v-btn>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      redes: undefined,
      dialog: false,
      dialogWPS: false,
      selectedNet: undefined,
      showPassword: false,
      password: "",
    };
  },

  created() {
    this.getNetworks();
  },

  watch: {
    dialog: {
      handler(value) {
        if (!value) {
          this.password = "";
        }
      },
    },
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
    conectTo(red) {
      if (red.encryptionKey === "on") {
        this.dialog = true;
        this.selectedNet = red;
      }
    },
    activateWPS() {
      this.dialogWPS = true;
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
    cursor: pointer;
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

.dialog {
  padding: 20px;
  background-color: #1d2027;

  .dialog-button {
    float: right;
  }
}

.dialogWPS {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  background-color: #1d2027;

  .mt-10 {
    margin-top: 10px;
  }
}
</style>