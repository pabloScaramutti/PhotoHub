<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="selection-icon">
        <v-icon
          :size="iconSize"
          dark
          v-bind="attrs"
          v-on="on"
          class="activator"
        >
          star
        </v-icon>
        <p>{{ rating ? `${modificadorPuntaje} ${rating}` : "-" }}</p>
      </div>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false"> Guardar </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <div class="flex align-baseline justify-center margin-auto h-100">
        <h3
          @click="changeModificadorPuntaje()"
          class="modificador-puntaje evitar-seleccion-txt"
        >
          {{ modificadorPuntaje }}
        </h3>
        <Puntaje v-on:nuevoPuntaje="changePuntaje($event)" size="60px" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Puntaje from "@/components/Puntaje";

export default {
  components: {
    Puntaje,
  },

  data() {
    return {
      dialog: false,
      selectedItem: undefined,
      modificadorPuntaje: "=",
      rating: 0,
    };
  },

  props: {
    iconSize: { type: String, default: "32px" },
    title: String,
  },

  methods: {
    changeModificadorPuntaje() {
      const modificadores = {
        "=": ">=",
        ">=": "<=",
        "<=": "=",
      };
      this.modificadorPuntaje = modificadores[this.modificadorPuntaje];
      this.$emit("cambio-modificador-puntaje", this.modificadorPuntaje);
    },

    changePuntaje(event) {
      this.rating = event != 0 ? event : undefined;
      this.$emit("changePuntaje", this.rating);
    },
  },
};
</script>

<style lang="scss" scoped>
.align-baseline {
  align-items: baseline;
}

.modificador-puntaje {
  cursor: pointer;
}

.selection-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>