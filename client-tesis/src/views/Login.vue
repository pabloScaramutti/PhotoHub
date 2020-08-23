<template>
  <div>
    <form v-on:keyup.enter="iniciarSesion">
      <p>
        <label for="mail">mail: </label>
        <input v-model="mail" type="text" placeholder="Mail..." />
      </p>
      <p>
        <label for="password">Contraseña: </label>
        <input v-model="password" type="password" placeholder="Contraseña..." />
      </p>
      <button type="button" :disabled="!validarCampos" @click="iniciarSesion">
        Login
      </button>
    </form>
  </div>
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
      password: undefined
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
