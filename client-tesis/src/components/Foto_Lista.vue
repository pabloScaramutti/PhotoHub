<template>
  <div
    class="foto-lista"
    :style="`width: ${width}; border-right: 8px solid ${color}`"
  >
    <template v-if="img.thumbnail">
      <router-link :to="`/fotos/${img.id}`">
        <img :src="getURL" alt="" class="photo" />
      </router-link>
      <div class="w98 h100 flex margin-auto">
        <div class="detalles w98">
          <router-link class="link" :to="`/fotos/${img.id}`">
            <h2 class="pad-left">{{ img.nombre }}</h2>
          </router-link>

          <!-- tenia puesto para sacar desde el exif directamente :puntajeInicial="img.exif.Rating" -->
          <Puntaje
            class="translate-up"
            :id="img.id"
            :size="'18'"
            :puntajeInicial="img.puntuacion"
            v-on:nuevoPuntaje="nuevoPuntaje"
          >
          </Puntaje>
          <div class="translate-up pad-left ul-flex-info">
            <ul v-if="state === 'especificaciones'">
              <li>
                <v-icon small>camera</v-icon>
                f{{ img.exif.Aperture }}
              </li>
              <li>
                <v-icon small>shutter_speed</v-icon>
                {{ img.exif.ShutterSpeed }}
              </li>
              <li>
                <v-icon small>iso</v-icon>
                {{ img.exif.ISO }}
              </li>
            </ul>
            <ul v-if="state === 'datosCamara'" class="flex flex-column">
              <li>
                <v-icon small>camera_alt</v-icon>
                {{ img.exif.Model }}
              </li>
              <li class="flex align-center" style="transform: translateX(-3px)">
                <img
                  src="@/assets/lens-icon.svg"
                  width="22rem"
                  height="22rem"
                />
                {{ img.exif.Lens }}
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
                  {{ getDate }}
                </li>
                <li>
                  <v-icon small>schedule</v-icon>
                  {{ getTime }}
                </li>
              </ul>
            </div>
            <ul v-if="state === 'etiquetas'">
              <li class="flex align-center tags-information flex-wrap">
                <v-icon small>local_offer</v-icon>
                <p v-for="(tag, index) in img.etiquetas" :key="index">
                  {{ `${tag.nombre}, ` }}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex justify-space-around h100 state-items">
          <ul style="padding-left: 2px">
            <li @click="state = 'especificaciones'">
              <v-icon
                size="20"
                :color="
                  state === 'especificaciones' ? 'white' : 'grey darken-3'
                "
                >image_search</v-icon
              >
            </li>
            <li v-if="checkPhoto()" @click="state = 'datosCamara'">
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
    </template>
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
      color: "gray",
      state: "especificaciones",
    };
  },
  mounted() {
    if (!this.img.exif.Rating) {
      this.img.exif.Rating = 0;
    }

    if (this.img.color) {
      if (this.img.color.nombre) this.color = this.img.color.nombre;
      else {
        this.$http
          .get(`/colores/${this.img.color}`)
          .then((r) => (this.color = r.data.nombre))
          .catch((e) =>
            console.log("Hubo un error para cargar etiqueta de color", e)
          );
      }
    }

    //console.log(this.img);
  },
  computed: {
    getURL() {
      return this.$apiUrl(this.img.thumbnail.formats.small.url);
    },
    getTime() {
      if (this.img.exif) return this.img.exif.CreateDate.split(" ")[1];
      else return this.img.created_at.split("T")[1].split(".")[0];
    },
    getDate() {
      if (this.img.exif)
        return this.img.exif.CreateDate.split(" ")[0]
          .split(":")
          .reverse()
          .join("/");
      else return this.img.created_at.split("T")[0];
    },
  },

  methods: {
    nuevoPuntaje(valor) {
      this.rating = valor;
    },

    checkPhoto() {
      return (
        (this.img.exif.FileType &&
          this.img.exif.FileType.toLowerCase() === "jpeg") ||
        (this.img.exif.FileType &&
          this.img.exif.FileType.toLowerCase() === "jpg") ||
        (this.img.exif.FileTypeExtension &&
          this.img.exif.FileType.toLowerCase() === "nef")
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.foto-lista:hover {
  background: #ffffff17;
}

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

  .photo {
    height: 115px;
    width: 115px;
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

  .w98 {
    width: 98%;
  }

  .h100 {
    height: 100%;
  }

  .tags-information {
    p {
      margin-bottom: 0;
      margin-left: 5px;
    }
  }

  .state-items {
    cursor: pointer;

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
  .link {
    color: inherit;
    text-decoration: none;
  }

  @media (max-width: 700px) and (orientation: portrait) {
    h2 {
      font-weight: 500;
      font-size: 1.1rem;
    }
  }
}
</style>