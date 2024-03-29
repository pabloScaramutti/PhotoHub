<template>
  <div style="height: 100%">
    <div v-if="imagen" :class="[fullView ? 'foto fullscreen' : 'foto']">
      <div
        class="fondo-contenedor-imagen"
        ref="foto"
        @click="informacion = !informacion"
      >
        <v-img
          v-if="showImage()"
          :max-height="fullView ? '100vh' : '90vh'"
          max-width="100vw"
          :src="
            $apiUrl(imagen.thumbnail.formats.large.url || imagen.thumbnail.url)
          "
          :lazy-src="
            $apiUrl(imagen.thumbnail.formats.large.url || imagen.thumbnail.url)
          "
          contain
          @load="onImageLoad()"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>
        <video v-else controls :width="videoWidth()">
          <source :src="$apiUrl(imagen.img.url)" type="video/mp4" />
        </video>
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
                {{ getDate }}
              </li>
              <li>
                <v-icon>schedule</v-icon>
                {{ getTime }}
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
              :puntajeInicial="imagen.puntuacion"
              :id="imagen.id"
              v-on:nuevoPuntaje="nuevoPuntaje"
              class="align-center"
            >
            </Puntaje>
            <div>
              <v-icon>folder</v-icon>
              <div class="divider" />
              <div class="flex jc-space-between">
                <p>
                  {{
                    imagen.carpeta
                      ? imagen.carpeta.nombre
                      : "No esta dentro de ningún album"
                  }}
                </p>
                <v-icon small>create</v-icon>
              </div>
            </div>
            <ColorTagPicker :imagen="imagen" />
            <div class="m-top-20px">
              <Search
                v-on:item-created="addTag($event)"
                v-on:item-selected="addSearchTag($event)"
                url="/etiquetas"
                label="Búsqueda de etiquetas"
                prependIcon="local_offer"
                :clearBeforeSelect="true"
              />
              <div class="flex" v-if="imagen.etiquetas">
                <v-chip
                  v-for="(tag, index) in imagen.etiquetas"
                  :key="index"
                  close
                  @click:close="removeTag(index)"
                  class="m-top-10px m-right-10px"
                  color="primary"
                >
                  {{ tag.nombre }}
                </v-chip>
              </div>

              <div class="grid">
                <v-checkbox
                  v-for="(tag, i) in allTags"
                  :key="i"
                  :value="tag"
                  v-model="tagSelected"
                  :label="`${tag.nombre}`"
                  @click="addTag(tag)"
                ></v-checkbox>
              </div>

              <v-btn
                v-if="editBtn.edit"
                fab
                color="primary"
                class="floating-btn"
                :loading="editBtn.loading"
                @click="updateTags()"
                ><v-icon>done</v-icon></v-btn
              >
            </div>
          </div>

          <!-- Detalles de las imagenes -->

          <div
            v-if="tabSelected === 'image-details' && imagen.thumbnail"
            class="w-80 scroll"
          >
            <div
              v-if="
                (imagen.exif.FileType &&
                  imagen.exif.FileType.toLowerCase() === 'jpeg') ||
                (imagen.exif.FileType &&
                  imagen.exif.FileType.toLowerCase() === 'jpg') ||
                (imagen.exif.FileTypeExtension &&
                  imagen.exif.FileType.toLowerCase() === 'nef') ||
                (imagen.exif.FileTypeExtension &&
                  imagen.exif.FileType.toLowerCase() === 'png')
              "
            >
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
                  <img
                    src="@/assets/lens-icon.svg"
                    width="50px"
                    height="50px"
                  />
                  {{ imagen.exif.FocalLength }}
                </li>
              </ul>
              <div class="divider"></div>
              <ul class="camera-info">
                <li>
                  <v-icon size="40px">camera_alt</v-icon>
                  {{ imagen.exif.Model }}
                </li>
                <li
                  class="flex align-center"
                  style="transform: translateX(-5px)"
                >
                  <img
                    src="@/assets/lens-icon.svg"
                    width="50px"
                    height="50px"
                  />
                  {{ imagen.exif.Lens }}
                </li>
              </ul>
            </div>

            <!-- Si es un video -->
            <div
              v-else-if="
                (imagen.exif.FileType &&
                  imagen.exif.FileType.toLowerCase() === 'mp4') ||
                (imagen.exif.FileType &&
                  imagen.exif.FileType.toLowerCase() === 'mov') ||
                (imagen.exif.FileTypeExtension &&
                  imagen.exif.FileType.toLowerCase() === 'mp4')
              "
            >
              <ul class="image-info">
                <li>
                  <v-icon size="50px">burst_mode</v-icon>
                  {{ imagen.exif.VideoFrameRate }} fps
                </li>
                <li>
                  <v-icon size="50px">aspect_ratio</v-icon>
                  {{ imagen.exif.ImageWidth }}px x
                  {{ imagen.exif.ImageHeight }}px
                </li>
                <li>
                  <v-icon size="50px">timer</v-icon>
                  {{ imagen.exif.Duration }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Mapa -->

          <div class="mapa" v-if="tabSelected === 'location'">
            <Mapa
              v-on:changeLocation="handlerChangeLocation($event)"
              :lat="imagen.exif.GPSLatitude"
              :long="imagen.exif.GPSLongitude"
              :img="imagen"
            ></Mapa>
          </div>
        </div>

        <!-- Flechas y ui ---------------------- -->

        <div v-else class="open-info" @click="informacion = !informacion">
          <div class="open-info-icon"></div>
        </div>
        <v-icon @click="changePhoto(1)" class="arrow next"
          >keyboard_arrow_right</v-icon
        >
        <v-icon @click="changePhoto(-1)" class="arrow previous"
          >keyboard_arrow_left</v-icon
        >
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
import Search from "@/components/Search";
import ColorTagPicker from "@/components/ColorTagPicker";

export default {
  components: {
    Puntaje,
    Mapa,
    Search,
    ColorTagPicker,
  },
  props: {},
  data() {
    return {
      imagen: undefined,
      informacion: false,
      fullView: false,
      puntaje: undefined,
      tabSelected: "tags",
      allTags: [],
      tagSelected: [],
      normalizeTagsSelected: false,
      editBtn: {
        edit: false,
        loading: false,
      },

      fotosIdList: [],
    };
  },

  created() {
    this.requestPhoto();

    this.$http
      .get("/etiquetas?_sort=nombre:ASC")
      .then((result) => {
        this.allTags = result.data;
      })
      .catch((error) =>
        console.log("No se pudieron cargar las etiquetas", error)
      );

    this.fotosIdList = JSON.parse(localStorage.getItem("listaDeFotos")).sort(
      function (a, b) {
        return a - b;
      }
    );

    window.addEventListener("keydown", (e) => {
      if (e.keyCode == 27) {
        this.informacion = false;
      }
    });
  },

  watch: {
    imagen: function () {
      if (!this.normalizeTagsSelected && this.allTags.length > 0) {
        this.imagen.etiquetas.forEach((e) => {
          let exist = this.existInArrayById(this.allTags, e);
          if (exist !== -1) this.tagSelected.push(this.allTags[exist]);
        });
        this.normalizeTagsSelected = true;
      }
    },

    "imagen.etiquetas": function () {
      if (this.normalizeTagsSelected) {
        this.editBtn.edit = true;
      }
    },

    allTags: function () {
      if (!this.normalizeTagsSelected && this.imagen) {
        this.imagen.etiquetas.forEach((e) => {
          let exist = this.existInArrayById(this.allTags, e);
          if (exist !== -1) this.tagSelected.push(this.allTags[exist]);
        });
        this.normalizeTagsSelected = true;
      }
    },
  },

  computed: {
    getTime() {
      if (this.imagen.exif) return this.imagen.exif.CreateDate.split(" ")[1];
      else return this.imagen.created_at.split("T")[1].split(".")[0];
    },
    getDate() {
      if (this.imagen.exif)
        return this.imagen.exif.CreateDate.split(" ")[0]
          .split(":")
          .reverse()
          .join("/");
      else return this.imagen.created_at.split("T")[0];
    },
  },

  methods: {
    requestPhoto() {
      this.$http
        .get(this.$route.path)
        .then((result) => {
          this.imagen = result.data;
        })
        .catch((error) => {
          console.log("Ocurrio un error", error);
        });
    },
    onImageLoad() {
      //console.log(this.imagen);
    },
    nuevoPuntaje(e) {
      //console.log("agarre el evento");
      this.puntaje = e;
      this.imagen.puntuacion = e;
    },

    removeTag(index) {
      let element = this.imagen.etiquetas.splice(index, 1);

      let exist = this.existInArrayById(this.tagSelected, element[0]);

      if (exist !== -1) this.tagSelected.splice(exist, 1);
    },

    addTag(e) {
      let exist = this.existInArrayById(this.imagen.etiquetas, e);

      if (exist !== -1) {
        this.removeTag(exist);
      } else {
        this.imagen.etiquetas.push(e);
      }
    },

    addSearchTag(e) {
      if (this.existInArrayById(this.tagSelected, e) == -1)
        this.tagSelected.push(e);
      if (this.existInArrayById(this.imagen.etiquetas, e) == -1)
        this.imagen.etiquetas.push(e);
    },

    existInArrayById(array, tag) {
      let exist = -1;

      array.forEach((elem, i) => {
        if (elem.id == tag.id) exist = i;
      });

      return exist;
    },

    updateTags() {
      const data = new FormData();
      const info = {
        etiquetas: this.imagen.etiquetas.map((e) => e.id),
      };

      console.log(info.etiquetas);
      this.editBtn.loading = true;

      data.append("data", JSON.stringify(info));

      this.$http
        .put(`/fotos/${this.imagen.id}`, data)
        .then((r) => {
          console.log("Se actualizaron las etiquetas de la foto:", r);
          this.editBtn.edit = false;
          this.editBtn.loading = false;
        })
        .catch((e) => {
          alert("Ocurrio un error en la actualización de las etiquetas", e);
          this.editBtn.loading = false;
        });
    },

    videoWidth() {
      return `${window.innerWidth - 50}px`;
    },

    showImage() {
      if (!this.imagen.img) {
        return true;
      } else {
        console.log(this.imagen.img.ext.toLowerCase().localeCompare(".mp4"));
        return (
          this.imagen.thumbnail &&
          !(
            this.imagen.img.ext.toLowerCase().localeCompare(".mp4") === 0 ||
            this.imagen.img.ext.toLowerCase().localeCompare(".mov") === 0
          )
        );
      }
    },

    changePhoto(step) {
      if (this.fotosIdList.length > 1) {
        let newPhotoIdIndex = this.fotosIdList.indexOf(this.imagen.id) + step;

        if (newPhotoIdIndex < 0) {
          newPhotoIdIndex = this.fotosIdList.length - 1;
        } else if (newPhotoIdIndex > this.fotosIdList.length - 1) {
          newPhotoIdIndex = 0;
        }

        this.$router.push({
          name: "Foto",
          params: { img: this.fotosIdList[newPhotoIdIndex] },
        });

        this.requestPhoto();
      }
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
      cursor: pointer;

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

  .flex {
    display: flex;
    flex-wrap: wrap;
  }

  .jc-space-between {
    justify-content: space-between;
  }

  .flex-row {
    flex-direction: row;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
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
