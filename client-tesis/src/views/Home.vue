<template>
  <div class="home">
    <v-slide-group v-model="model" class="hidden-md-and-down">
      <v-slide-item v-for="item in imagenes" :key="item">
        <v-card height="11em" width="11em" style="margin:0px">
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
          <v-row class="fill-height" align="center" justify="center">
            <v-scale-transition>
              <v-icon
                v-if="active"
                color="white"
                size="48"
                v-text="'mdi-close-circle-outline'"
              ></v-icon>
            </v-scale-transition>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
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
  }
};
</script>
