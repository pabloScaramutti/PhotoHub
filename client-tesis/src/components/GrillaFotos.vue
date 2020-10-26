<template>
  <v-container fluid class="grilla">
    <v-row>
      <v-col
        v-for="item in imageSelector"
        :key="item.img"
        class="d-flex child-flex"
        cols="4"
        sm="4"
        md="2"
        style="padding:0"
      >
        <router-link :to="{ name: 'Foto' }" tag="button" :disabled="selectable">
          <v-img
            :src="item.img"
            :lazy-src="item.img"
            class="grey lighten-2 foto"
            aspect-ratio="1"
            @click="selectable && (item.selector = !item.selector)"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
            <v-checkbox
              v-if="selectable"
              class="selection-checkbox"
              v-model="item.selector"
              disabled
            ></v-checkbox>
          </v-img>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      imageSelector: this.agregarCheck(this.imagenes)
    };
  },
  props: {
    imagenes: {
      type: Array,
      required: true
    },
    selectable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    agregarCheck: function(imagenes) {
      var aux = [];
      for (var i = 0; i < imagenes.length; i++) {
        var img = { img: imagenes[i], selector: false };
        aux.push(img);
      }
      return (this.imageSelector = aux);
    }
  }
};
</script>

<style lang="scss" scope>
.grilla {
  .foto {
    margin: 0.05em;
  }

  .foto:hover {
    z-index: 1;
    transform: scale(1.01);
  }

  .selection-checkbox {
    margin-top: 0;
    padding-top: 0;
  }

  .v-input--is-disabled .v-icon {
    color: white !important;
    opacity: 1 !important;
  }
}
</style>
