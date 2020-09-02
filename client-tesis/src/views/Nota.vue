<template>
  <v-container>
    <v-container style="padding:0">
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field 
            ref="Titulo"
            label="Titulo"
            placeholder="Escriba el titulo de la nota..."
            outlined
            v-model="titulo"
            :append-icon="(noEditableTitulo == true) ? 'edit' : 'none'"
            :color="noEditableTitulo ? 'teal lighten-5' : 'primary'"
            @click:append="noEditableTitulo = false; focusTextArea('Titulo')"
            :readonly="noEditableTitulo"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Fecha de creación"
            outlined
            v-model="fechaCreacion"
            color="teal lighten-5"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" xm="6" md="3">
          <v-text-field
            label="Fecha de ultima modificación"
            outlined
            v-model="fechaModificacion"
            color="teal lighten-5"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-textarea
      outlined
      ref="Nota"
      label="Nota"
      placeholder="Escriba una nueva nota..."
      v-model="texto"
      :append-icon="(noEditableNota== true) ? 'edit' : 'none'"
      :color="noEditableNota ? 'teal lighten-5' : 'primary'"
      @click:append="noEditableNota = false; focusTextArea('Nota')"
      :readonly="noEditableNota"
    >
    </v-textarea>
    <v-btn
      v-if="!(noEditableNota && noEditableTitulo)"
      color="primary"
      class="negro--text"
      @click="guardar"
    >
      <v-icon left>save</v-icon>
      Guardar
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "Nota",
  data() {
    return {
      texto: "",
      titulo: "",
      fechaCreacion: "01/09/2020",
      fechaModificacion: "05/09/2020",
      noEditableNota: true,
      noEditableTitulo: true,
      edicionActivaV: false
    };
  },
  methods: {
    guardar() {
      this.noEditableNota = true;
      this.noEditableTitulo = true;
    },
    focusTextArea( area ) {
      this.$refs[area].$refs.input.focus();
    }
  },
};
</script>

<style></style>
