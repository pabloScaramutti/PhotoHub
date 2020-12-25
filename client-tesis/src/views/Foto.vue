<template>
  <div style="height: 100%">
    <div v-if="imagen" :class="[fullView ? 'foto fullscreen' : 'foto']">
      <div
        class="fondo-contenedor-imagen"
        ref="foto"
        @click="informacion = !informacion"
      >
        <v-img
          :max-height="fullView ? '100vh' : '90vh'"
          max-width="100vw"
          :src="$apiUrl(imagen.thumbnail.url)"
          :lazy-src="$apiUrl(imagen.thumbnail.url)"
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
            <h1>{{ imagen.nombre }}</h1>

            <ul class="time-date">
              <li>
                <v-icon>today</v-icon>
                {{ getDate() }}
              </li>
              <li>
                <v-icon>schedule</v-icon>
                {{ getTime() }}
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
              :class="
                tabSelected === 'location' ? 'active-tab' : 'inactive-tab'
              "
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
              <div class="divider flex" />
              <p>Una carpeta / Otra carpeta / Otra</p>
              <v-icon small>create</v-icon>
            </div>
            <div>
              <v-icon>palette</v-icon>
              <div class="divider" />
              <div class="flex">
                <div
                  v-for="(color, index) in colors"
                  :key="index"
                  @click="imagen.color = color"
                  :style="`background-color: ${color.nombre}; border: ${
                    imagen.color.nombre === color.nombre
                      ? '4px solid white'
                      : 'none'
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
            <div class="m-top-20px">
              <v-icon>local_offer</v-icon>
              <div class="divider" />
              <div class="flex">
                <v-chip
                  v-for="(tag, index) in imagen.etiquetas"
                  :key="index"
                  close
                  @click:close="chip1 = false"
                  class="m-top-10px m-right-10px"
                  color="primary"
                >
                  {{ tag.nombre }}
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

          <div v-if="tabSelected === 'image-details'" class="w-80 scroll">
            <ul class="image-info">
              <li>
                <v-icon size="50px">camera</v-icon>
                f{{ imagen.exif.Aperture }}
              </li>
              <li>
                <v-icon size="50px">shutter_speed</v-icon>
                {{ imagen.exif.ShutterSpeed }}
              </li>
              <li>
                <v-icon size="50px">iso</v-icon>
                {{ imagen.exif.ISO }}
              </li>
              <li>
                <v-icon size="50px">flash_off</v-icon>
                {{ imagen.exif.Flash }}
              </li>
              <li>
                <v-icon size="50px">wb_sunny</v-icon>
                No es el valor real
              </li>
              <li>
                <img src="@/assets/lens-icon.svg" width="50px" height="50px" />
                {{ imagen.exif.FocalLength }}
              </li>
            </ul>
            <div class="divider"></div>
            <ul class="camera-info">
              <li>
                <v-icon size="40px">camera_alt</v-icon>
                {{ imagen.exif.Model }}
              </li>
              <li class="flex align-center" style="transform: translateX(-5px)">
                <img src="@/assets/lens-icon.svg" width="50px" height="50px" />
                {{ imagen.exif.Lens }}
              </li>
            </ul>
          </div>

          <div class="mapa" v-if="tabSelected === 'location'">
            <div class="location">
              <v-icon>location_on</v-icon> Un lugar, Argentina
            </div>
            <Mapa></Mapa>
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
    <v-progress-circular
      v-else
      indeterminate
      size="50"
      color="primary"
      class="loading"
    ></v-progress-circular>
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
      imagen: undefined,
      informacion: false,
      fullView: false,
      puntaje: undefined,
      createNewColor: {
        dialog: false,
        color: "#FF0000",
      },
      tabSelected: "tags",
      colors: ["red", "blue", "green", "cyan", "#28DAC3"],
      tags: ["montaña", "rio", "viejoManzano", "naturaleza"],
    };
  },

  created() {
    this.$http
      .get(this.$route.path)
      .then((result) => {
        this.imagen = result.data;
        //console.log(this.imagen);
      })
      .catch((error) => {
        console.log("Ocurrio un error", error);
      });

    this.$http
      .get("/colores")
      .then((result) => (this.colors = result.data))
      .catch((error) => {
        console.log("No se pudieron cargar los colores", error);
      });
  },

  methods: {
    onImageLoad() {
      //console.log(this.imagen);
    },
    nuevoPuntaje(e) {
      //console.log("agarre el evento");
      this.puntaje = e;
    },
    getTime() {
      return this.imagen.exif.DateTimeOriginal.split(" ")[1];
    },
    getDate() {
      return this.imagen.exif.DateTimeOriginal.split(" ")[0]
        .split(":")
        .reverse()
        .join("/");
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

    .scroll {
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
    cursor: pointer;
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
