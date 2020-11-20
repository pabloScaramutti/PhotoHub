<template>
  <div
    class="foto-lista"
    :style="`width: ${width}; border-right: 8px solid ${color}`"
  >
    <img :src="img" alt="" />
    <div class="w98 h100 flex">
      <div class="detalles w98">
        <h2 class="pad-left">Nombre de la imagen</h2>
        <Puntaje
          class="translate-up"
          :size="18"
          :puntajeInicial="rating"
          v-on:nuevoPuntaje="nuevoPuntaje"
        >
        </Puntaje>
        <div class="translate-up pad-left ul-flex-info">
          <ul v-if="state === 'especificaciones'">
            <li>
              <v-icon small>camera</v-icon>
              f18
            </li>
            <li>
              <v-icon small>shutter_speed</v-icon>
              1/32
            </li>
            <li>
              <v-icon small>iso</v-icon>
              1200
            </li>
          </ul>
          <ul v-if="state === 'datosCamara'">
            <li>
              <v-icon small>camera_alt</v-icon>
              Nikon D3500
            </li>
            <li>
              <v-icon small>camera_alt</v-icon>
              55-300mm f/4.5-5.6
            </li>
          </ul>
          <div v-if="state === 'ubicacion'">
            <ul>
              <li>
                <v-icon small>location_on</v-icon>
                Bariloche, Rio Negro
              </li>
            </ul>
            <ul>
              <li>
                <v-icon small>today</v-icon>
                11/09/20
              </li>
              <li>
                <v-icon small>alarm</v-icon>
                12:20am
              </li>
            </ul>
          </div>
          <ul v-if="state === 'etiquetas'">
            <li>
              <v-icon small>local_offer</v-icon>
              etiquetas
            </li>
          </ul>
        </div>
      </div>
      <div class="flex justify-space-around h100 state-items">
        <ul style="padding-left: 2px">
          <li @click="state = 'especificaciones'">
            <v-icon
              size="20"
              :color="state === 'especificaciones' ? 'white' : 'grey darken-3'"
              >image_search</v-icon
            >
          </li>
          <li @click="state = 'datosCamara'">
            <v-icon
              size="20"
              :color="state === 'datosCamara' ? 'white' : 'grey darken-3'"
              >camera_alt</v-icon
            >
          </li>
          <li @click="state = 'ubicacion'">
            <v-icon
              size="20"
              :color="state === 'ubicacion' ? 'white' : 'grey darken-3'"
              >location_on</v-icon
            >
          </li>
          <li @click="state = 'etiquetas'">
            <v-icon
              size="20"
              :color="state === 'etiquetas' ? 'white' : 'grey darken-3'"
              >local_offer</v-icon
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Puntaje from "@/components/Puntaje";

export default {
  name: "FotoLista",
  components: {
    Puntaje,
  },
  props: {
    img: {
      type: undefined,
      required: true,
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  data: () => {
    return {
      rating: 3,
      color: "blue",
      state: "especificaciones",
    };
  },
  methods: {
    // getImageSrc() {
    //   return `http://192.168.0.123:1337${this.img.thumbnail.url}`;
    // },
    nuevoPuntaje(valor) {
      this.rating = valor;
    },
  },
};
</script>

<style lang="scss" scoped>
.foto-lista {
  height: fit-content;
  //width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  //border-right: 8px solid blueviolet;
  margin-top: 4px;

  .detalles {
    margin-left: 0.5vw;
  }

  img {
    height: 12vh;
    width: 12vh;
    object-fit: cover;
    object-position: center;
    border-radius: 3px;
    cursor: pointer;
  }

  h2 {
    font-size: 1.3rem;
  }

  .translate-up {
    transform: translateY(-7px);
  }

  .pad-left {
    padding-left: $rating-padding;
  }

  .flex {
    display: flex;
  }

  .justify-space-around {
    justify-content: space-around;
  }

  .w98 {
    width: 98%;
  }

  .h100 {
    height: 100%;
  }

  .state-items {
    li {
      margin-bottom: 4px;
      margin-right: 2px;
    }
  }

  ul {
    list-style-type: none;
  }

  .ul-flex-info {
    ul {
      padding: 0;
      padding-left: $rating-padding;
      margin: 0;

      display: flex;
      flex-wrap: wrap;

      li {
        margin-right: 10px;
        font-weight: 100;
        font-size: 0.9rem;
      }
    }
  }

  @media (max-width: 700px) and (orientation: portrait) {
    h2 {
      font-weight: 500;
      font-size: 1.1rem;
    }

    img {
      height: 115px;
      width: 115px;
    }
  }
}
</style>