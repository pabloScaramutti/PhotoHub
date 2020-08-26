<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button type="button" @click="cerrarSesion">Loggout</button>
    <button type="button" @click="iniciarSession">Login</button>
  </div>
</template>

<script>
import { AccionesNombres } from "@/store/actions/acciones";

export default {
  methods: {
    cerrarSesion() {
      this.$store.dispatch(AccionesNombres.Logout);
      this.$router.push({ name: "Home" }).catch(err => {
        return err;
      });
    },
    iniciarSession() {
      this.$router.push({ name: "Login" }).catch(err => {
        return err;
      });
    }
  }
};
</script>
