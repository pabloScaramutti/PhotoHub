<template>
  <div class="foto">
    <div class="fondo-contenedor-imagen" ref="foto">
      <v-img
        max-height="70vh"
        :src="imagen"
        :lazy-src="imagen"
        style="margin: 0.05em"
        contain
      >
        <template v-slot:placeholder>
          <v-row class="fill-height" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5" />
          </v-row>
        </template>
      </v-img>
    </div>

    <div>
      <h1>Nombre imagen</h1>

      <div @click="checkearCero">
        <v-rating
          v-model="rating"
          color="primary"
          background-color="grey darken-1"
          empty-icon="$ratingFull"
          :hover="!tactil"
        ></v-rating>
      </div>

      <ul>
        <li>
          <v-icon>camera</v-icon>
          apertura
        </li>
        <li>
          <v-icon>shutter_speed</v-icon>
          velocidad
        </li>
        <li>
          <v-icon>iso</v-icon>
          iso
        </li>
        <li>
          <v-icon>local_offer</v-icon>
          etiquetas
        </li>

        <li>
          <v-icon>delete</v-icon>
          Borrar
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imagen: require("@/assets/Media/DSC_0338.jpg"),
      rating: 0.0,
      ratingAnterior: 0.0,
      tactil:
        this.$vuetify.breakpoint.name == "xs" ||
        this.$vuetify.breakpoint.name == "sm"
          ? true
          : false
    };
  },
  methods: {
    checkearCero() {
      if (this.rating == this.ratingAnterior && this.ratingAnterior == 1) {
        this.rating = this.ratingAnterior = 0.0;
      } else {
        this.ratingAnterior = this.rating;
      }
    }
  }
};
</script>

<style lang="scss">
.foto {
  .fondo-contenedor-imagen {
    background: #1b1b1b;
  }

  ul {
    padding: 0;
    margin: 0;
    width: fit-content;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    //justify-content: flex-start;

    li {
      margin-right: 0.7vw;
    }
  }
}
</style>
