<template>
  <div>
    <v-toolbar dense flat style="background: transparent; height: 2.5rem">
      <router-link :to="`/carpetas/${carpeta.id}`">
        <v-toolbar-title style="font-size: 1.1rem">
          {{ carpeta.nombre }}
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon @click="setFavorite()" :loading="loadingFavorite">
        <v-icon :color="carpeta.favoritos ? 'primary' : 'white'"
          >mdi-heart</v-icon
        >
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider class="mx-4" style="margin-bottom: 0.3rem"></v-divider>

    <v-slide-group>
      <v-slide-item v-for="(item, i) in carpeta.fotos" :key="i">
        <router-link :to="{ name: 'Foto', params: { img: `${item.id}` } }">
          <v-card
            :height="tamImagenes()"
            :width="tamImagenes()"
            style="margin: 0 2px; border-radius: 3px"
          >
            <img
              :src="
                $apiUrl(
                  item.thumbnail.formats
                    ? item.thumbnail.formats.medium.url
                    : item.thumbnail.url
                )
              "
              :alt="item.nombre"
              class="imagen-slider"
            />
          </v-card>
        </router-link>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
export default {
  props: {
    carpeta: {
      type: undefined,
      required: true,
    },
  },

  data() {
    return {
      loadingFavorite: false,
    };
  },

  methods: {
    tamImagenes() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "7.5em";
        case "sm":
          return "7.5em";
        case "md":
          return "10em";
        case "lg":
          return "10em";
        case "xl":
          return "10em";
        default:
          return "7.5em";
      }
    },

    setFavorite() {
      this.loadingFavorite = true;
      this.$http
        .put(`/carpetas/${this.carpeta.id}`, {
          favoritos: !this.carpeta.favoritos,
        })
        .then((r) => {
          console.log("La carpeta ahora es favorita", r);
          this.carpeta.favoritos = !this.carpeta.favoritos;
          this.loadingFavorite = false;
        })
        .catch((e) => {
          console.log("No se pudo actualizar el estado de favorito", e);
          this.loadingFavorite = false;
        });
    },
  },
};
</script>

<style scoped>
.v-application a {
  text-decoration: none;
  color: white;
}

.imagen-slider {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.imagen-slider:hover {
  transform: scale(1.03);
}
</style>
