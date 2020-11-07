<template>
  <div>
    <v-toolbar dense flat style="background: transparent; height:2.5rem">
      <router-link to="">
        <v-toolbar-title style="font-size: 1.1rem;">
          {{ titulo }}
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider class="mx-4" style="margin-bottom: .3rem"></v-divider>

    <v-slide-group>
      <v-slide-item v-for="item in imagenes" :key="item">
        <router-link :to="{ name: 'Foto', params: { img: item } }">
          <v-card
            :height="tamImagenes()"
            :width="tamImagenes()"
            style="margin: 0 2px; border-radius: 3px;"
          >
            <img :src="item" :alt="item" class="imagen-slider" />
          </v-card>
        </router-link>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
export default {
  props: {
    imagenes: {
      type: undefined,
      required: true
    },
    titulo: {
      type: String,
      required: true
    }
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
    }
  }
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
