<template>
  <div :class="[fullView ? 'foto fullscreen' : 'foto']">
    <div
      class="fondo-contenedor-imagen"
      ref="foto"
      @click="fullView = !fullView"
    >
      <v-img
        :max-height="fullView ? '100vh' : '90vh'"
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
    <template v-if="!fullView">
      <div class="foto_info" v-if="informacion">
        <div class="hide-info">
          <v-icon @click="informacion = !informacion">highlight_off</v-icon>
        </div>

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
      <v-icon
        v-else
        class="arrow arrow-info"
        @click="informacion = !informacion"
        >keyboard_arrow_up</v-icon
      >
      <v-icon class="arrow next">keyboard_arrow_right</v-icon>
      <v-icon class="arrow previous">keyboard_arrow_left</v-icon>
    </template>
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
      informacion: false,
      fullView: false,
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
      //console.log(this.imagen);
    },
  },
};
</script>

<style lang="scss" scope>
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  background-color: black;
}

.foto {
  i:hover {
    cursor: pointer;
  }

  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .fondo-contenedor-imagen {
    background: #0000;
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
    width: 80%;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    //justify-content: flex-start;

    li {
      margin-right: 0.7vw;
    }
  }

  .foto_info {
    padding: 9vh 5vw;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 99vh;
    bottom: 0;
    background: rgb(17, 17, 17);
  }

  .arrow {
    position: fixed;

    background-color: rgba(0, 0, 0, 0.486);
    padding: 0.3em;
    border-radius: 50%;
  }

  .arrow:hover {
    background-color: black;
  }

  .next {
    right: 1vw;
    bottom: 50%;
  }

  .previous {
    left: 1vw;
    bottom: 50%;
  }

  .hide-info {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-right: 1vw;
  }

  .arrow-info {
    bottom: 9vh;
    left: 50%;
  }

  @media (max-width: 500px) {
    h1 {
      font-size: 1.3em;
      margin: 0;
    }

    ul {
      font-size: 0.8em;
    }

    .arrow-info {
      left: 45%;
    }
  }
}
</style>
