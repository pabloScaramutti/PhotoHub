<template>
  <v-app>
    <div style="margin: auto">
      <v-form v-model="valido">
        <div>
          <v-img src="@/assets/logo-tesis.png" height="170" contain></v-img>
        </div>
        <v-text-field
          prepend-icon="mdi-account-circle"
          label="Nombre de usuario"
          v-model="cuenta.username"
          :rules="camposRules"
          type="text"
        />
        <v-text-field
          prepend-icon="mdi-email"
          label="Mail"
          v-model="cuenta.mail"
          :rules="mailRules"
          type="text"
        />
        <v-text-field
          label="Contraseña"
          :rules="camposRules"
          v-model="cuenta.password"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
        <v-text-field
          label="Confirme su contraseña"
          :rules="camposRules"
          v-model="passwordConffirmation"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
        <br />
        <v-btn
          block
          rounded
          color="primary"
          class="negro--text"
          :disabled="!valido"
          @click="enviarFormulario"
        >
          Enviar
        </v-btn>
      </v-form>
    </div>
  </v-app>
</template>

<script>
import { AccionesNombres } from "@/store/actions/acciones";

export default {
  name: "Registro",

  data: () => ({
    valido: false,
    showPassword: false,
    cuenta: {
      username: undefined,
      password: undefined,
      mail: undefined
    },
    passwordConffirmation: "",
    mailRules: [
      v => !!v || "Campo obligatorio",
      v => /.+@.+/.test(v) || "Tiene que ser un mail valido"
    ],
    camposRules: [v => !!v || "Campo obligatorio"]
  }),

  methods: {
    enviarFormulario() {
      if (this.valido) {
        if (this.cuenta.password == this.passwordConffirmation) {
          this.$store
            .dispatch(AccionesNombres.Registro, this.cuenta)
            .then(response => {
              console.log("An error occurred:", response.data.user);
              this.$router.push({ name: "Home" });
            })
            .catch(error => {
              console.log("An error occurred:", error.response);
            });
        } else {
          this.passwordConffirmation = "";
          this.cuenta.password = "";
        }
      }
    }
  }
};
</script>
