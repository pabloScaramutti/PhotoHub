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
            style="margin:0px; border-radius: 0;"
          >
            <v-img
              :src="item"
              :lazy-src="item"
              class="grey lighten-2"
              style="margin: 0.05em"
              aspect-ratio="1"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-row>
              </template>
            </v-img>
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
</style>
