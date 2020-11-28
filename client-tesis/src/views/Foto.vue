<template>
  <div :class="[fullView ? 'foto fullscreen' : 'foto']">
    <div
      class="fondo-contenedor-imagen"
      ref="foto"
      @click="informacion = !informacion"
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
      <div class="image-info-container" v-if="informacion">
        <div class="general-info">
          <h1>Nombre imagen</h1>

          <ul class="time-date">
            <li>
              <v-icon>today</v-icon>
              01/10/20
            </li>
            <li>
              <v-icon>schedule</v-icon>
              12:20am
            </li>
          </ul>
        </div>

        <ul class="tabs">
          <li
            :class="tabSelected === 'tags' ? 'active-tab' : 'inactive-tab'"
            @click="tabSelected = 'tags'"
          >
            <v-icon>local_offer</v-icon>
          </li>
          <li
            :class="
              tabSelected === 'image-details' ? 'active-tab' : 'inactive-tab'
            "
            @click="tabSelected = 'image-details'"
          >
            <v-icon>image_search</v-icon>
          </li>
          <li
            :class="tabSelected === 'location' ? 'active-tab' : 'inactive-tab'"
            @click="tabSelected = 'location'"
          >
            <v-icon>location_on</v-icon>
          </li>
        </ul>

        <div v-if="tabSelected === 'tags'">
          <Puntaje
            :size="'6vh'"
            :puntajeInicial="puntaje"
            v-on:nuevoPuntaje="nuevoPuntaje"
          >
          </Puntaje>
        </div>

        <ul class="image-info" v-if="tabSelected === 'image-details'">
          <li>
            <v-icon size="50px">camera</v-icon>
            apertura
          </li>
          <li>
            <v-icon size="50px">shutter_speed</v-icon>
            velocidad
          </li>
          <li>
            <v-icon size="50px">iso</v-icon>
            iso
          </li>
          <li>
            <v-icon size="50px">flash_off</v-icon>
            off
          </li>
          <li>
            <v-icon size="50px">wb_sunny</v-icon>
            1500k
          </li>
        </ul>
        <div class="mapa" v-if="tabSelected === 'location'">
          <Mapa> </Mapa>
        </div>
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
import Puntaje from "@/components/Puntaje";
import Mapa from "@/components/Mapa";

export default {
  components: {
    Puntaje,
    Mapa,
  },
  props: {},
  data() {
    return {
      imagen: this.$route.params.img,
      informacion: true,
      fullView: false,
      puntaje: undefined,
      tabSelected: "tags",
    };
  },
  methods: {
    onImageLoad() {
      //console.log(this.imagen);
    },
    nuevoPuntaje(e) {
      //console.log("agarre el evento");
      this.puntaje = e;
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
  background-color: #141519;
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
    background: black;
  }

  .image-info-container {
    //padding: 2vh 5vw 10vh 5vw;
    padding-top: 4vh;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 80vh;
    bottom: 0;
    background: #141519;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

    .general-info {
      width: 100%;
      align-items: flex-start;
      margin-left: 50px;

      .time-date {
        display: flex;
        //justify-content: center;
        list-style-type: none;
        padding: 0;

        li {
          //margin-left: 10px;
          margin-right: 10px;
          width: fit-content;
        }
      }
    }

    .tabs {
      width: 100%;
      display: flex;
      justify-content: space-around;
      list-style-type: none;
      padding: 0;
      margin: 2vh 0;

      li {
        width: 33%;
        display: flex;
        justify-content: center;
        padding-bottom: 7px;
      }

      .inactive-tab {
        border-bottom: 1px solid gray;

        i {
          color: #bcbcbf;
        }
      }
    }

    .active-tab {
      border-bottom: 2px solid #49c1f1;
    }

    .image-info {
      padding: 0;
      margin: 0;
      list-style-type: none;
      width: 80%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      li {
        margin: 5vw;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    .mapa {
      width: 100%;
      height: 100%;
      margin-top: 1vh;
    }
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
