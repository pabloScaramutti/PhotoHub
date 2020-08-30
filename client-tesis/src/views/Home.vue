<template>
  <div class="home">
    <div>
      <v-toolbar dense flat style="background: transparent">
        <v-toolbar-title>Nombre del album</v-toolbar-title>
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
        </v-slide-item>
      </v-slide-group>
    </div>
    <!---------------------------------------------------------------------->
    <v-container fluid>
      <v-row>
        <v-col
          v-for="item in imagenes"
          :key="item"
          class="d-flex child-flex"
          cols="4"
          sm="4"
          md="2"
          style="padding:0"
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
        </v-col>
      </v-row>
    </v-container>
    <router-link :to="{ name: 'Login' }">
      <v-btn block rounded color="primary"> Login </v-btn>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      imagenes: [
        require("@/assets/Media/DSC_0615.jpg"),
        require("@/assets/Media/DSC_0171.jpg"),
        require("@/assets/Media/DSC_0288.jpg"),
        require("@/assets/Media/DSC_0294.jpg"),
        require("@/assets/Media/DSC_0338.jpg"),
        require("@/assets/Media/DSC_0342.jpg"),
        require("@/assets/Media/DSC_0353.jpg"),
        require("@/assets/Media/DSC_0362.jpg"),
        require("@/assets/Media/DSC_0370.jpg"),
        require("@/assets/Media/DSC_0373.jpg"),
        require("@/assets/Media/DSC_0374.jpg"),
        require("@/assets/Media/DSC_0380.jpg"),
        require("@/assets/Media/DSC_0397.jpg"),
        require("@/assets/Media/DSC_0423.jpg"),
        require("@/assets/Media/DSC_0449.jpg")
      ],
      cadena: undefined
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
    }
  }
};
</script>
