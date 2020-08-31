<template>
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
        <router-link :to="{ name: 'Foto' }">
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
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    imagenes: {
      type: undefined,
      required: true
    }
  }
};
</script>
