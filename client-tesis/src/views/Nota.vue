<template>
  <div>
    <v-expansion-panels v-model="paneles">
      <v-expansion-panel :readonly="seEstaEditando">
        <v-expansion-panel-header @click="avisoGuardado">
          <v-row no-gutters>
            <v-col>
              <v-text-field
                dense
                hide-details
                ref="Titulo"
                label="Titulo"
                placeholder="Escriba el titulo de la nota..."
                outlined
                v-model="titulo"
                :append-icon="noEditableTitulo == true ? 'edit' : 'none'"
                :color="noEditableTitulo ? 'teal lighten-5' : 'primary'"
                @click:append="
                  noEditableTitulo = false;
                  focusTextArea('Titulo');
                  paneles = 0;
                "
                :readonly="noEditableTitulo"
                style="width: 98%"
              ></v-text-field>
              <p class="fecha">
                {{ fechaCreacion }}
              </p>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-divider></v-divider>
        <v-expansion-panel-content
          style="padding: 1rem 0 0 0; background-color: #0f0f0f"
        >
          <v-textarea
            outlined
            hide-details
            ref="Nota"
            label="Nota"
            placeholder="Escriba una nueva nota..."
            v-model="texto"
            :append-icon="noEditableNota == true ? 'edit' : 'none'"
            :color="noEditableNota ? 'teal lighten-5' : 'primary'"
            @click:append="
              noEditableNota = false;
              focusTextArea('Nota');
            "
            :readonly="noEditableNota"
          >
          </v-textarea>
          <v-btn
            v-if="seEstaEditando"
            color="primary"
            class="negro--text"
            @click="guardar"
            style="margin: 1rem 0 0 0"
          >
            <v-icon left>save</v-icon>
            Guardar
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-snackbar v-model="alerta">
      "Guarde las notas que estan activas antes de cerrar"

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="alerta = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Nota",
  data() {
    return {
      texto: "",
      titulo: "",
      noEditableNota: true,
      fechaCreacion: new Date().toLocaleString(),
      noEditableTitulo: true,
      paneles: undefined,
      alerta: false,
    };
  },
  methods: {
    guardar() {
      this.noEditableNota = true;
      this.noEditableTitulo = true;
    },
    focusTextArea(area) {
      this.$refs[area].$refs.input.focus();
    },
    avisoGuardado() {
      if (this.seEstaEditando && event.target.tagName != "INPUT") {
        this.alerta = true;
      }
    },
  },
  computed: {
    seEstaEditando: function () {
      return !(this.noEditableNota && this.noEditableTitulo);
    },
  },
};
</script>

<style>
.fecha {
  font-size: 0.8rem !important;
  color: lightgray !important;
  margin: 0.5rem 0rem 0 0.8rem !important;
}
</style>
