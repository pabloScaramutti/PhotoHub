<template>
  <v-container fluid class="grilla">
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
        <router-link :to="{ name: 'Foto' }" tag="button" :disabled="selectable">
          <v-img
            :src="item"
            :lazy-src="item"
            class="grey lighten-2 foto"
            aspect-ratio="1"
            @click="toggleSelection(item)"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
            <v-icon
              v-if="selectable && existe(selected, item) == -1"
              class="selection-checkbox"
              >check_box_outline_blank</v-icon
            >
            <v-icon v-else class="selection-checkbox">check_box</v-icon>
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
      selected: []
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
    toggleSelection(img) {
      var index = this.existe(this.selected, img);
      if (index != -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(img);
      }
      return this.selected;
    },

    existe(arreglo, img) {
      if (arreglo == null || arreglo.length < 1) {
        return -1;
      } else {
        for (var i = 0; i < arreglo.length; i++) {
          if (arreglo[i].localeCompare(img) == 0) {
            return i;
          }
        }
        return -1;
      }
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
    display: flex;
    justify-content: flex-end;
  }
}
</style>
