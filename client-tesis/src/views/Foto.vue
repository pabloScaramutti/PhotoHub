<template>
  <div class="foto">
    <div
      class="fondo-contenedor-imagen"
      ref="foto"
      @click="informacion = !informacion"
    >
      <v-img
        max-height="90vh"
        max-width="100vw"
        :src="imagen"
        :lazy-src="imagen"
        contain
        @load="onImageLoad()"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5" />
          </v-row>
        </template>
      </v-img>
    </div>

    <!-- Info -------------------------- -->
    <div v-if="informacion" class="foto_info">
      <div class="titulo">
        <h1>Nombre imagen</h1>
        <v-icon>delete</v-icon>
      </div>

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
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      imagen: this.$route.params.img,
      rating: 0.0,
      ratingAnterior: 0.0,
      tactil:
        this.$vuetify.breakpoint.name == "xs" ||
        this.$vuetify.breakpoint.name == "sm"
          ? true
          : false,
      informacion: true
    };
  },
  methods: {
    checkearCero() {
      if (this.rating == this.ratingAnterior && this.ratingAnterior == 1) {
        this.rating = this.ratingAnterior = 0.0;
      } else {
        this.ratingAnterior = this.rating;
      }
    },
    onImageLoad() {
      console.log(this.imagen);
    }
  }
};
</script>

<style lang="scss">
.foto {
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .fondo-contenedor-imagen {
    background: #1b1b1b;
  }

  .titulo {
    display: flex;
    align-items: center;

    * {
      margin-right: 2vw;
    }
  }

  ul {
    padding: 0;
    margin: 0;
    width: 50%;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    //justify-content: flex-start;

    li {
      margin-right: 0.7vw;
    }
  }

  .foto_info {
    padding: 2vw;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100vw;
    height: 25vh;
    bottom: 5vh;
    background: rgba(0, 0, 0, 0.712);
  }

  @media (max-width: 500px) {
    h1 {
      font-size: 1.3em;
      margin: 0;
    }

    ul {
      font-size: 0.8em;
    }

    .foto_info {
      height: 25vh;
      bottom: 8vh;
    }
  }
}
</style>
