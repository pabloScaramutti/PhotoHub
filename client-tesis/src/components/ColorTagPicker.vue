<template>
  <div>
    <v-icon>palette</v-icon>
    <div class="divider" />
    <div class="flex wrap">
      <div
        v-for="(color, index) in colors"
        :key="index"
        @click="imagen ? saveColorOnImage(color) : saveColor(color)"
        :style="`background-color: ${color.nombre}; border: ${
          selectedColor.id === color.id ? '4px solid white' : 'none'
        }`"
        class="m-top-10px color-tag"
      ></div>
      <div
        @click.stop="createNewColor.dialog = true"
        class="m-top-10px color-tag"
        style="background-color: white"
      >
        <p
          style="
            color: black;
            font-weight: 300;
            text-align: center;
            transform: translateY(-8px);
            font-size: 1.5em;
          "
        >
          +
        </p>
      </div>

      <!-- Color Picker -->
      <v-dialog v-model="createNewColor.dialog" max-width="290">
        <v-card>
          <v-color-picker
            v-model="createNewColor.color"
            hide-inputs
          ></v-color-picker>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="createNewColor.dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn @click="createColor()" color="primary">
              <v-icon>done</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      createNewColor: {
        dialog: false,
        color: "#FF0000",
      },
      colors: [],
      selectedColor: { id: undefined },
    };
  },

  props: {
    imagen: undefined,
    initialValue: undefined,
  },

  created() {
    if (this.imagen)
      this.selectedColor = this.imagen?.color || this.dummyColor();
    else this.selectedColor.id = this.initialValue;

    this.$http
      .get("/colores")
      .then((result) => (this.colors = result.data))
      .catch((error) => {
        console.log("No se pudieron cargar los colores", error);
      });
  },

  watch: {
    imagen: function (newImagen) {
      this.selectedColor = newImagen?.color || this.dummyColor();
    },
    initialValue: function (newValue) {
      this.selectedColor = newValue || this.dummyColor();
    },
  },

  methods: {
    dummyColor() {
      return { id: undefined };
    },

    createColor() {
      this.$http
        .post("/colores", {
          nombre: this.createNewColor.color,
        })
        .then((result) => {
          console.log(
            "Se creó la etiqueta de color:",
            this.createNewColor.color,
            "en la base de datos",
            result
          );
          this.colors.push(result.data);
        })
        .catch((error) =>
          console.log("Hubo un problema creando la etiqueta de color", error)
        );
      this.createNewColor.dialog = false;
    },

    saveColor(c) {
      this.selectedColor = c;
      this.$emit("colorSelected", c);
    },

    saveColorOnImage(c) {
      if (!this.imagen) return;
      this.selectedColor = c;
      this.$http
        .put(`/fotos/${this.imagen.id}`, { color: c.id })
        .then((r) => {
          console.log("Se actualizó el color de la foto:", r);
          this.imagen.color = c;
        })
        .catch((e) => {
          this.selectedColor = this.imagen.color;
          console.log("Ocurrió un error actualizando el color:", e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.color-tag {
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 20px;
}
.divider {
  width: 100%;
  border-bottom: 1px solid white;
}

.m-top-10px {
  margin-top: 10px;
}

.wrap {
  flex-wrap: wrap;
}
</style>