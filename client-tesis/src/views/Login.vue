<template>
  <v-app>
    <div style="margin: auto">
      <div>
        <v-img src="@/assets/logo-tesis.png" height="170" contain></v-img>
      </div>
      <div class="mx-auto mt-5" v-on:keyup.enter="iniciarSesion">
        <v-form>
          <v-text-field
            prepend-icon="mdi-account-circle"
            label="Mail o nombre de usuario"
            v-model="mail"
            type="text"
          />
          <v-text-field
            label="Contraseña"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <v-btn
            block
            rounded
            color="primary"
            class="negro--text"
            :disabled="!validarCampos"
            @click="iniciarSesion"
          >
            Login
          </v-btn>
          <div class="separator">o</div>
          <v-btn
            :to="{ name: 'Registro' }"
            rounded
            outlined
            block
            color="primary"
          >
            Registrarse
          </v-btn>
        </v-form>
      </div>
    </div>
  </v-app>
</template>

<script>
import { AccionesNombres } from "@/store/actions/acciones";

export default {
  name: "Login",
  computed: {
    validarCampos() {
      if (this.mail && this.password) {
        return true;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      mail: undefined,
      password: undefined,
      showPassword: false
    };
  },
  methods: {
    iniciarSesion() {
      if (!this.validarCampos) return;
      this.$store
        .dispatch(AccionesNombres.Login, {
          identifier: this.mail.toLowerCase(),
          password: this.password
        })
        .then(response => {
          console.log("User profile", response.data.user);
          console.log("User token", response.data.jwt);
          this.$router.push({ name: "Home" });
        })
        .catch(error => {
          console.log("An error occurred:", error.response);
          this.mail = "";
          this.password = "";
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.separator {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  display: flex;
  align-items: center;
  text-align: center;
}
.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgb(175, 175, 175);
}
.separator::before {
  margin-right: 0.25em;
}
.separator::after {
  margin-left: 0.25em;
}
</style>
