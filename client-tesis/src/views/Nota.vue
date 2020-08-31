<template>
  <v-container>
    <v-textarea
      outlined
      name="input"
      label="Nota"
      placeholder="Escriba una nueva nota..."
      v-model="texto"
    ></v-textarea>
    <v-btn>Guardar</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "Nota",
  data() {
    return {
      texto: ""
    };
  }
};
</script>

<style></style>
