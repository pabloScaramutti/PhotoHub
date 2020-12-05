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
        <div class="open-info-icon" @click="informacion = !informacion"></div>
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

        <div v-if="tabSelected === 'tags'" class="tags-countainer">
          <Puntaje
            :size="'6vh'"
            :puntajeInicial="puntaje"
            v-on:nuevoPuntaje="nuevoPuntaje"
            class="align-center"
          >
          </Puntaje>
          <div>
            <v-icon>folder</v-icon>
            <div class="divider" />
            <p>Una carpeta / Otra carpeta / Otra</p>
          </div>
          <div>
            <v-icon>palette</v-icon>
            <div class="divider" />
            <div class="flex">
              <div
                v-for="color in colors"
                :key="color"
                @click="colorSelected = color"
                :style="`background-color: ${color}; border: ${
                  colorSelected === color ? '4px solid white' : 'none'
                }`"
                class="m-top-10px color-tag"
              ></div>
            </div>
          </div>
          <div class="m-top-20px">
            <v-icon>local_offer</v-icon>
            <div class="divider" />
            <div class="flex">
              <v-chip
                v-for="tag in tags"
                :key="tag"
                close
                @click:close="chip1 = false"
                class="m-top-10px m-right-10px"
                color="#49c1f1"
              >
                {{ tag }}
              </v-chip>
            </div>
            <div class="grid">
              <v-checkbox
                v-for="i in 37"
                :key="i"
                :label="`Etiqueta ${i}`"
              ></v-checkbox>
            </div>
          </div>
        </div>

        <div v-if="tabSelected === 'image-details'" class="w-80">
          <ul class="image-info">
            <li>
              <v-icon size="50px">camera</v-icon>
              f1.8
            </li>
            <li>
              <v-icon size="50px">shutter_speed</v-icon>
              1/60
            </li>
            <li>
              <v-icon size="50px">iso</v-icon>
              800
            </li>
            <li>
              <v-icon size="50px">flash_off</v-icon>
              off
            </li>
            <li>
              <v-icon size="50px">wb_sunny</v-icon>
              1500k
            </li>
            <li>
              <img src="@/assets/lens-icon.svg" width="50px" height="50px" />
              50mm
            </li>
          </ul>
          <div class="divider"></div>
          <ul class="camera-info">
            <li>
              <v-icon size="40px">camera_alt</v-icon>
              Nikon D5300
            </li>
            <li class="flex align-center" style="transform: translateX(-5px)">
              <img src="@/assets/lens-icon.svg" width="50px" height="50px" />
              Nikkor 55-300mm f4.5/6.5
            </li>
          </ul>
        </div>

        <div class="mapa" v-if="tabSelected === 'location'">
          <div class="location">
            <v-icon>location_on</v-icon> Un lugar, Argentina
          </div>
          <Mapa> </Mapa>
        </div>
      </div>

      <!-- Flechas y ui ---------------------- -->

      <div v-else class="open-info" @click="informacion = !informacion">
        <div class="open-info-icon"></div>
      </div>
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
      informacion: false,
      fullView: false,
      puntaje: undefined,
      tabSelected: "tags",
      colorSelected: "cyan",
      colors: ["red", "blue", "green", "cyan"],
      tags: ["montaña", "rio", "viejoManzano", "naturaleza"],
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

  .open-info-icon {
    width: 35px;
    height: 5px;
    margin-bottom: 0.3rem;
    border-radius: 5px;
    background-color: #bbbbbd;
    cursor: pointer;
  }

  .open-info {
    position: fixed;
    height: 30px;
    background-color: #1d2027;
    padding: 10px;
    border-radius: 10px;
    bottom: 50px;
    //left: 50%;
    cursor: pointer;
  }

  .image-info-container {
    //padding: 2vh 5vw 10vh 5vw;
    padding-top: 2vh;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 84%;
    bottom: 0;
    background: #141519;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    margin-bottom: 56px;

    p {
      font-weight: 100;
    }

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
      height: 30px;
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

      .active-tab {
        border-bottom: 2px solid #49c1f1;
      }
    }

    .tags-countainer {
      width: 80%;
      display: flex;
      flex-direction: column;

      overflow: scroll;
    }

    .image-info {
      padding: 0;
      margin: 0;
      list-style-type: none;
      width: 100%;
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

    .camera-info {
      li {
        margin: 2vh;
        list-style-type: none;
        align-items: center;
      }
    }

    .mapa {
      width: 100%;
      height: 100%;

      .location {
        margin: 0 1vh 2vh 1vh;
      }
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

  .divider {
    width: 100%;
    border-bottom: 1px solid white;
  }

  .color-tag {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
  }

  .jc-space-around {
    justify-content: space-between;
  }

  .flex-row {
    flex-direction: row;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 120px);
    grid-gap: 0px;
    justify-content: space-between;
  }

  .m-top-10px {
    margin-top: 10px;
  }

  .w-80 {
    width: 80%;
  }

  .m-top-20px {
    margin-top: 20px;
  }

  .m-right-10px {
    margin-right: 10px;
  }

  .align-center {
    align-self: center;
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
